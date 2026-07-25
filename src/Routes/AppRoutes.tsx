import { Routes, Route, useLocation } from "react-router-dom";
import Register from "../pages/Register/register";
import Login from "../pages/Login/login";
import WelcomePage from "../pages/index"; 
import LandingPage from "../pages/Landing/LandingPage";
import { AnimatePresence } from "framer-motion";
import Dashboard from "../pages/Dashboard/Dashboard";
import Verify from "../pages/Verify/Verify";
import ProtectedRoute from "../component/ProtectedRoute/ProtectedRoute";
import Profile from "../pages/Profile/Profile";
import DashboardLayout from "../component/DashboardLayout/DashboardLayout";
import Devices from "../pages/Devices/Devices";
import Analytics from "../pages/Analytics/Analytics";
import AllTransactions from "../pages/AllTransactions/AllTransactions";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/all-transactions" element={<AllTransactions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/devices" element={<Devices />} />
        </Route>

      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;