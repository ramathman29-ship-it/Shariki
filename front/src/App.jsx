import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./component/Layout";
import Login from "./pages/main/Login";
import NotFound from "./pages/main/NotFound";
import MyHouses from "./pages/user/MyHouses";
import Houses from "./pages/main/Houses";
import Intro from "./pages/main/Intro";
import Sell from "./pages/main/Sell";
import AboutUs from "./pages/main/AboutUs";
import UserRequests from "./pages/user/UserRequests";
import HouseDetails from "./pages/main/HouseDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./component/ProtectedRoute";
import UserAccount from "./pages/user/UserAccount";
import SellRequest from "./pages/admin/SellRequest"; // طلبات الشراء
import PublishRequest from "./pages/admin/PublishRequest"; // طلبات النشر
import ClickSpark from "./components/ClickSpark";
import Reports from "./pages/admin/Reports"
import "./style/App.css";


export default function App() {
  return (
    <ClickSpark
      sparkColor="#220c0cff"
      sparkSize={10}
      sparkRadius={18}
      sparkCount={10}
      duration={450}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Intro />} />
          <Route path="/aboutus" element={<AboutUs />} />
          </Route>
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/houses" element={<Houses />} />
          <Route path="/Admin" element={<PublishRequest />} />
          <Route path="/Admin2" element={<SellRequest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/useraccount" element={<UserAccount />} />
          <Route path="/houses/:id" element={<HouseDetails />} />

          <Route
            path="/myRequests"
            element={
              <ProtectedRoute>
                <UserRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/AdminDashbored"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sellyourHouse"
            element={
              <ProtectedRoute>
                <Sell />
              </ProtectedRoute>
            }
          />

          <Route
            path="/host"
            element={
              <ProtectedRoute>
                <MyHouses />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ClickSpark>
  );
}
