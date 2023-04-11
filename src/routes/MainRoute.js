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

const MainRoute = () => {
  const userData = getLocalStorageItem(USER.USER_DATA);
  const token = getLocalStorageItem(USER.ACCESS_TOKEN);
  console.log(token)

  if (token) {
    return (
      <>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="verify">
              <Route path=":email/:token" element={<EmailVerification />} />
            </Route>
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
      <Route path="verify">
        <Route path=":email/:token" element={<EmailVerification />} />
      </Route>
      <Route path="404" element={<Page404 />} />
      {/* <Route path="*" element={<Navigate to="/404" state={{ from: location }} replace />} /> */}
    </Routes>
  );

};

export default MainRoute;
