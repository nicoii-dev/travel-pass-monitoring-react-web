import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "../layouts";
import { getLocalStorageItem } from "../utils/getLocalStorage";
import { USER } from "../utils/constants/user";

// pages
import HomePage from "../pages/home";
import EmailVerification from "../pages/EmailVerification";
import Signin from "../pages/auth/signin/Signin";
import Signup from "../pages/auth/signup/Signup";
import Page404 from "../pages/Page404";
import ForgotPassword from "../pages/auth/forgot-password/ForgotPassword";
import EmailVerify from "../pages/EmailVerify";
import ResetPassword from "../pages/auth/reset-password/ResetPassword";
import User from "../pages/users/User";
import CreateUser from "../pages/users/CreateUser";
import ViewUser from "../pages/users/ViewUser";

const MainRoute = () => {
  const location = useLocation();
  const userData = getLocalStorageItem(USER.USER_DATA);
  const token = getLocalStorageItem(USER.ACCESS_TOKEN);
  console.log(userData)
  if (token && userData.role === 'admin') {
    return (
      <>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="manage-lsi" element={<User />} />
            <Route path="medical-reservations" element={<User />} />
            <Route path="travel-pass-applications" element={<User />} />
            <Route path="user" element={<User />} />
            <Route path="user/create" element={<CreateUser />} />
            <Route path="user/view" element={<ViewUser />} />
            <Route path="reports" element={<User />} />
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

  if (token && userData.role === 'medicalStaff') {
    return (
      <>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="manage-lsi" element={<User />} />
            <Route path="medical-appointments" element={<User />} />
            <Route path="schedule" element={<User />} />
            <Route path="profile" element={<User />} />
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

  if (token && userData.role === 'police') {
    return (
      <>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="manage-lsi" element={<User />} />
            <Route path="travel-pass-applications" element={<User />} />
            <Route path="profile" element={<User />} />
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
      <Route path="/" element={<Signin />} />
      <Route path="signin" element={<Signin />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="resetpass" element={<ResetPassword />} />
      <Route path="verify">
        <Route path=":email/:token" element={<EmailVerification />} />
      </Route>
      <Route path="email-verify" element={<EmailVerify />} />
      <Route path="404" element={<Page404 />} />
      {/* <Route
        path="*"
        element={<Navigate to="/404" state={{ from: location }} replace />}
      /> */}
    </Routes>
  );
};

export default MainRoute;
