import { ROUTES } from "@/app/routes";

/** Where each backend notification type should take the user. */
const TARGETS = {
  request_pending_approval: ROUTES.admin.listings,
  property_approved: ROUTES.account.properties,
  new_request: ROUTES.account.requests,
  request_accepted: ROUTES.account.requests,
  request_rejected: ROUTES.account.requests,
  contract_uploaded: ROUTES.account.properties,
  payment_authorized: ROUTES.account.requests,
  payment_captured: ROUTES.account.requests,
  payment_canceled: ROUTES.account.requests,
};

export const notificationTarget = (notification) => TARGETS[notification?.type] || ROUTES.home;
