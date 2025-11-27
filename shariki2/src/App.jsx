import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Login from "./Login";
import NotFound from "./NotFound";
import MyHouses from "./MyHouses";
import Houses from "./Houses";
import Intro from "./Intro";
import Sell from "./sell";
import AboutUs from "./AboutUs";
import UserRequests from "./UserRequests";
import HouseDetails from "./HouseDetails";
import AdminDashboard from "./AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import SellRequest from "./SellRequest"; // طلبات الشراء
import PublishRequest from "./PublishRequest"; // طلبات النشر
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/Admin" element={<PublishRequest />} />
          <Route path="/Admin2" element={<SellRequest />} />


        <Route path="/login" element={<Login />} />
        <Route path="//houses" element={<Houses />} />
        <Route path="/house/:id" element={<HouseDetails />} />

        
        <Route
          path="/host"
          element={ 
            <ProtectedRoute>
              <MyHouses />
            </ProtectedRoute>
          }
        />


        <Route path="/" element={<Layout />}>
          <Route index element={<Intro />} />
          <Route path="/houses" element={<Houses />} />
          <Route
            path="/myRequests"
            element={
              <ProtectedRoute>
                <UserRequests />
              </ProtectedRoute>
            }
          />
          <Route
          path="/addHouses"
          element={
            <ProtectedRoute>
              <Sell />
            </ProtectedRoute>
          }
        />
          <Route path="/about" element={<AboutUs />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
