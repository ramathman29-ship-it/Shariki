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
// import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./component/ProtectedRoute";
import SellRequest from "./pages/admin/SellRequest"; // طلبات الشراء
import PublishRequest from "./pages/admin/PublishRequest"; // طلبات النشر
import "./style/App.css";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Intro />} />
        </Route>
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="//houses" element={<Houses />} />
        <Route path="/Admin" element={<PublishRequest />} />
        <Route path="/Admin2" element={<SellRequest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/house/:id" element={<HouseDetails />} />
        <Route
            path="/myRequests"
            element={
              <ProtectedRoute>
                <UserRequests />
              </ProtectedRoute>
            }
        />
        <Route path="/houses" element={<Houses />} />
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
  );
}
