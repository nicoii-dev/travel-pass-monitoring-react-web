import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "../layouts";
import { getLocalStorageItem } from "../utils/getLocalStorage";
import { USER } from "../utils/constants/user";

// pages
import HomePage from "../pages/users-pages/home";
import EmailVerification from "../pages/EmailVerification";
import Signin from "../pages/auth/signin/Signin";
import Signup from "../pages/auth/signup/Signup";
import Page404 from "../pages/Page404";
import ForgotPassword from "../pages/auth/forgot-password/ForgotPassword";
import EmailVerify from "../pages/EmailVerify";
import ResetPassword from "../pages/auth/reset-password/ResetPassword";
import User from "../pages/admins-pages/users/User";
import CreateUser from "../pages/admins-pages/users/create/CreateUser"
import ViewUser from "../pages/admins-pages/users/view/ViewUser";

import Schedules from "../pages/admins-pages/schedules/Schedules";
import CreateSchedule from "../pages/admins-pages/schedules/CreateSchedules";
import ViewSchedule from "../pages/admins-pages/schedules/ViewSchedules";
import Lsi from "../pages/admins-pages/lsi/LSI";
import ViewLsi from "../pages/admins-pages/lsi/viewLsi";
import MedicalSchedules from "../pages/users-pages/medical-schedules/MedicalSchedules";
import MedicalAppointments from "../pages/admins-pages/medical-appointments/MedicalAppointments";
import MedicalApplications from "../pages/admins-pages/medical-applications/MedicalAppilcations";
import UserProfile from "../pages/admins-pages/medical-appointments/view-update/UserProfile";
import MedicalUserProfile from "../pages/admins-pages/medical-applications/view/UserProfile";
import UserProfileViewOnly from "../pages/admins-pages/medical-appointments/view-only/UserProfileViewOnly";
import TravelPassAppointments from "../pages/admins-pages/travel-pass-appointments/TravelPassAppointments";
import TravelPassApplications from "../pages/admins-pages/travel-pass-applications/TravelPassApplications";
import TravelPassSchedules from "../pages/users-pages/travel-pass-schedules/TravelPassSchedules";
import ProfilePage from "../pages/users-pages/profile/ProfilePage";
import UserQrDetails from "../pages/admins-pages/scanned-qr/UserQrDetails";
import LandingPage from "../pages/LandingPage";
import TravelPassApplicationForm from "../pages/admins-pages/travel-pass-appointments/view-only/ApplicationForm";
import TravelPassView from "../pages/admins-pages/travel-pass-appointments/view-only/TravelPassView";
import TravelPassApplicationView from "../pages/admins-pages/travel-pass-applications/view/TravelPassApplicationView";
import AdminDashboard from "../pages/admins-pages/dashboard/AdminDashboard";

const MainRoute = () => {
  const location = useLocation();
  const userData = getLocalStorageItem(USER.USER_DATA);
  const token = getLocalStorageItem(USER.ACCESS_TOKEN);

  if (token && userData.role.toLowerCase() === 'admin') {
    return (
      <>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="locally-stranded-individual" element={<Lsi />} />
            <Route path="locally-stranded-individual/view/:id" element={<ViewLsi />} />
            <Route path="medical-appointments" element={<MedicalAppointments />} />
            <Route path="medical-appointments/user/view-update/:id" element={<UserProfile />} />
            <Route path="medical-appointments/user/view-only/:id" element={<UserProfileViewOnly />} />
            <Route path="medical-applications" element={<MedicalApplications />} />
            <Route path="medical-applications/create" element={<MedicalUserProfile />} />
            <Route path="medical-applications/view/:id" element={<MedicalUserProfile />} />
            <Route path="travel-pass-appointments" element={<TravelPassAppointments />} />
            <Route path="travel-pass-appointments/view/:id" element={<TravelPassView />} />
            <Route path="travel-pass-applications/view/:id" element={<TravelPassApplicationView />} />
            <Route path="travel-pass-applications" element={<TravelPassApplications />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="schedules/create" element={<CreateSchedule />} />
            <Route path="schedules/view/:id" element={<ViewSchedule />} />
            <Route path="user" element={<User />} />
            <Route path="user/create" element={<CreateUser />} />
            <Route path="user/view/:id" element={<ViewUser />} />
            <Route path="reports" element={<User />} />
            <Route path="404" element={<Page404 />} />
            <Route path="scanned-qr/:id" element={<UserQrDetails />} />
            <Route
              path="*"
              element={
                <Navigate to="/404" state={{ from: location }} replace />
              }
            />
          </Route>
        </Routes>
      </>
    );
  }

  if (token && userData.role.toLowerCase() === 'medicalstaff') {
    return (
      <>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="locally-stranded-individual" element={<Lsi />} />
            <Route path="locally-stranded-individual/view/:id" element={<ViewLsi />} />
            <Route path="medical-appointments" element={<MedicalAppointments />} />
            <Route path="medical-appointments/user/view-update/:id" element={<UserProfile />} />
            <Route path="medical-appointments/user/view-only/:id" element={<UserProfileViewOnly />} />
            <Route path="medical-applications" element={<MedicalApplications />} />
            <Route path="medical-applications/create" element={<MedicalUserProfile />} />
            <Route path="medical-applications/view/:id" element={<MedicalUserProfile />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="schedules/create" element={<CreateSchedule />} />
            <Route path="schedules/view/:id" element={<ViewSchedule />} />
            <Route path="404" element={<Page404 />} />
            <Route path="scanned-qr/:id" element={<UserQrDetails />} />
            <Route
              path="*"
              element={
                <Navigate to="/404" state={{ from: location }} replace />
              }
            />
          </Route>
        </Routes>
      </>
    );
  }

  if (token && userData.role.toLowerCase() === 'police') {
    return (
      <>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="locally-stranded-individual" element={<Lsi />} />
            <Route path="locally-stranded-individual/view/:id" element={<ViewLsi />} />
            <Route path="medical-applications" element={<MedicalApplications />} />
            <Route path="medical-applications/create" element={<MedicalUserProfile />} />
            <Route path="medical-applications/view/:id" element={<MedicalUserProfile />} />
            <Route path="travel-pass-appointments" element={<TravelPassAppointments />} />
            <Route path="travel-pass-appointments/view/:id" element={<TravelPassView />} />
            <Route path="travel-pass-applications/view/:id" element={<TravelPassApplicationView />} />
            <Route path="travel-pass-applications" element={<TravelPassApplications />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="schedules/create" element={<CreateSchedule />} />
            <Route path="schedules/view/:id" element={<ViewSchedule />} />
            <Route path="404" element={<Page404 />} />
            <Route path="scanned-qr/:id" element={<UserQrDetails />} />
            <Route
              path="*"
              element={
                <Navigate to="/404" state={{ from: location }} replace />
              }
            />
          </Route>
        </Routes>
      </>
    );
  }

  if (token && userData.role.toLowerCase() === 'lsi') {
    return (
      <>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="medical-schedules" element={<MedicalSchedules />} />
            <Route path="travel-pass-schedules" element={<TravelPassSchedules />} />
            <Route path="404" element={<Page404 />} />
            <Route
              path="*"
              element={
                <Navigate to="/404" state={{ from: location }} replace />
              }
            />
          </Route>
        </Routes>
      </>
    );
  }


  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="landing" element={<LandingPage />} />
      <Route path="signin" element={<Signin />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="resetpass" element={<ResetPassword />} />
      <Route path="verify">
        <Route path=":email/:token" element={<EmailVerification />} />
      </Route>
      <Route path="email-verify" element={<EmailVerify />} />
      <Route path="404" element={<Page404 />} />
      <Route
        path="*"
        element={<Navigate to="/404" state={{ from: location }} replace />}
      />
    </Routes>
  );
};

export default MainRoute;
