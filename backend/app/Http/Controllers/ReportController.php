<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\User;
use App\Models\Poperity;
use App\Models\Request as RequestModel;
use App\Models\Investment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ReportController extends Controller
{

    public function generateDailyReport(): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user || !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            $today = Carbon::today();
            $yesterday = Carbon::yesterday();


            $usersToday = User::whereDate('created_at', $today)->count();
            $usersYesterday = User::whereDate('created_at', $yesterday)->count();


            $notApproved = Poperity::where('is_approved', false)->count();
            $partialSold = Poperity::whereHas(
                'typeRequest',
                fn($q) => $q->where('name', 'partialSell')
            )
                ->count();
            $fullSold = Poperity::whereHas(
                'typeRequest',
                fn($q) => $q->where('name', 'fullSell')
            )
                ->count();
            $rent = Poperity::whereHas('typeRequest', fn($q) => $q->where('name', 'rent'))->count();


            $requestsToday = RequestModel::whereDate('created_at', $today)->count();
            $pendingRequests = RequestModel::where('status', 'pending')->count();
            $acceptedRequests = RequestModel::where('status', 'accepted')->count();
            $rejectedRequests = RequestModel::where('status', 'rejected')->count();


            $partialSalesToday = RequestModel::where('status', 'investment')->whereDate('updated_at', $today)->count();
            $fullSalesToday = Poperity::whereDate('updated_at', $today)
                ->whereHas('typeRequest', function ($q) {
                    $q->where('name', 'done');
                })
                ->count();

            $partialSalesYesterday = RequestModel::where('status', 'investment')->whereDate('updated_at', $yesterday)->count();
            $fullSalesYesterday = Poperity::whereDate('updated_at', $yesterday)
                ->whereHas('typeRequest', function ($q) {
                    $q->where('name', 'done');
                })
                ->count();

            $partialImprovementRate = $this->growthRate($partialSalesToday, $partialSalesYesterday);
            $fullImprovementRate = $this->growthRate($fullSalesToday, $fullSalesYesterday);



            $data = [
                'date' => $today->format('Y-m-d'),

                'users' => [
                    'new_today' => $usersToday,
                    'new_yesterday' => $usersYesterday,
                    'total' => User::count(),
                    'growth_rate' => $this->growthRate($usersToday, $usersYesterday) . '%'
                ],

                'properties' => [
                    'not_approved' => $notApproved,
                    'partial_sold' => $partialSold,
                    'fully_sold' => $fullSold,
                    'rent' => $rent,

                ],

                'requests' => [
                    'today' => $requestsToday,
                    'pending' => $pendingRequests,
                    'accepted' => $acceptedRequests,
                    'rejected' => $rejectedRequests
                ],

                'sales' => [
                    'partial_sales_today' => $partialSalesToday,
                    'full_sales_today' => $fullSalesToday,
                    'partial_sales_yesterday' => $partialSalesYesterday,
                    'full_sales_yesterday' => $fullSalesYesterday,
                    'partial_sales_improvement' => $partialImprovementRate . '%',
                    'full_sales_improvement' => $fullImprovementRate . '%'
                ]
            ];

            $report = Report::create([
                'title' => 'Daily Admin Report - ' . $today->format('Y-m-d'),
                'type' => 'daily',
                'data' => $data,
                'generated_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Daily admin report generated successfully',
                'report' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate report',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function generateMonthlyReport(): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user || !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            $startThisMonth = Carbon::now()->startOfMonth();
            $endThisMonth   = Carbon::now()->endOfMonth();

            $startLastMonth = Carbon::now()->subMonthNoOverflow()->startOfMonth();
            $endLastMonth   = Carbon::now()->subMonthNoOverflow()->endOfMonth();

            $usersThisMonth = User::whereBetween('created_at', [$startThisMonth, $endThisMonth])->count();
            $usersLastMonth = User::whereBetween('created_at', [$startLastMonth, $endLastMonth])->count();

            $notApproved = Poperity::where('is_approved', false)->count();
            $partialSold = Poperity::whereHas('typeRequest', fn($q) => $q->where('name', 'partialSell'))->count();
            $fullSold = Poperity::whereHas('typeRequest', fn($q) => $q->where('name', 'fullSell'))->count();
            $rent = Poperity::whereHas('typeRequest', fn($q) => $q->where('name', 'rent'))->count();


            $partialSalesThisMonth = RequestModel::where('status', 'investment')->whereBetween(
                'updated_at',
                [$startThisMonth->toDateString(), $endThisMonth->toDateString()]
            )->count();

            $partialSalesLastMonth =  RequestModel::where('status', 'investment')->whereBetween(
                'updated_at',
                [$startLastMonth->toDateString(), $endLastMonth->toDateString()]
            )->count();


            $fullSalesThisMonth = Poperity::whereHas('typeRequest', function ($q) {
                $q->where('name', 'done');
            })
                ->whereBetween('updated_at', [$startThisMonth, $endThisMonth])
                ->count();

            $fullSalesLastMonth = Poperity::whereHas('typeRequest', function ($q) {
                $q->where('name', 'done');
            })
                ->whereBetween('updated_at', [$startLastMonth, $endLastMonth])
                ->count();


            $acceptedRequestsThisMonth = RequestModel::where('status', 'accepted')
                ->whereBetween('updated_at', [$startThisMonth, $endThisMonth])
                ->count();

            $acceptedRequestsLastMonth = RequestModel::where('status', 'accepted')
                ->whereBetween('updated_at', [$startLastMonth, $endLastMonth])
                ->count();


            $partialImprovement = $this->growthRate(
                $partialSalesThisMonth,
                $partialSalesLastMonth
            );

            $fullImprovement = $this->growthRate(
                $fullSalesThisMonth,
                $fullSalesLastMonth
            );

            $requestsImprovement = $this->growthRate(
                $acceptedRequestsThisMonth,
                $acceptedRequestsLastMonth
            );


            $totalSalesThisMonth = $partialSalesThisMonth + $fullSalesThisMonth;

            $conversionRate = $acceptedRequestsThisMonth > 0
                ? round(($totalSalesThisMonth / $acceptedRequestsThisMonth) * 100, 1)
                : 0;


            $data = [
                'month' => $startThisMonth->format('Y-m'),

                'users' => [
                    'new_this_month' => $usersThisMonth,
                    'new_last_month' => $usersLastMonth,
                    'growth_rate' => $this->growthRate($usersThisMonth, $usersLastMonth),
                    'total' => User::count()
                ],
                'properties' => [
                    'not_approved' => $notApproved,
                    'partial_sold' => $partialSold,
                    'full_sold' => $fullSold,
                    'rent' => $rent,
                    'total' => Poperity::count()
                ],
                'sales' => [
                    'partial_sales_this_month' => $partialSalesThisMonth,
                    'partial_sales_last_month' => $partialSalesLastMonth,
                    'partial_sales_improvement' => $partialImprovement,

                    'full_sales_this_month' => $fullSalesThisMonth,
                    'full_sales_last_month' => $fullSalesLastMonth,
                    'full_sales_improvement' => $fullImprovement,
                ],

                'requests' => [
                    'accepted_this_month' => $acceptedRequestsThisMonth,
                    'accepted_last_month' => $acceptedRequestsLastMonth,
                    'accepted_improvement' => $requestsImprovement,
                    'conversion_rate' => $conversionRate
                ]
            ];


            Report::create([
                'title' => 'Monthly Admin Report - ' . $startThisMonth->format('Y-m'),
                'type' => 'monthly',
                'data' => $data,
                'generated_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Monthly admin report generated successfully',
                'report' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate monthly report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function growthRate($current, $previous): float
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }
}
