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

const MainRoute = () => {
  const location = useLocation();
  const userData = getLocalStorageItem(USER.USER_DATA);
  const token = getLocalStorageItem(USER.ACCESS_TOKEN);

  if (token) {
    return (
      <>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/" element={<HomePage />} />
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
