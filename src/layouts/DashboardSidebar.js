import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
// hooks
import useResponsive from "../hooks/useResponsive";
// components
import Logo from "../components/Logo";
import Scrollbar from "../components/Scrollbar";
import NavSection from "../components/NavSection";
//
import { getLocalStorageItem } from "../utils/getLocalStorage";
import { USER } from "../utils/constants/user";

// navigations
import AdminNav from "./nav-config.js/AdminNav";
import PoliceNav from "./nav-config.js/PoliceNav";
import MedicalStaffNav from "./nav-config.js/MedicalStaffNav";
import UserNav from "./nav-config.js/UserNav";
import { isMobile } from "react-device-detect";
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};
const adminAvatar = "/assets/icons/admin.png";
const policeAvatar = "/assets/icons/policeman.png";
const medicalStaffAvatar = "/assets/icons/nurse.png";
const userAvatar = "/assets/icons/man.png";

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const userData = getLocalStorageItem(USER.USER_DATA);
  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  console.log(userData.role)
  const navConfigHandler = () => {
    switch (userData.role) {
      case "admin":
        return AdminNav;
      case "police":
        return PoliceNav;
      case "medicalStaff":
        return MedicalStaffNav;
      case "user":
        return UserNav;

      default:
        break;
    }
  };

  const avatarConfig = () => {
    switch (userData.role) {
      case "admin":
        return adminAvatar;
      case "police":
        return policeAvatar;
      case "medicalStaff":
        return medicalStaffAvatar;
      case "user":
        return userAvatar;

      default:
        break;
    }
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
        backgroundColor: '#FFD700'
      }}
    >
      <Box sx={{ display: isMobile ? "flex" : "inline-flex", justifyContent: 'center', mt: 5, mb: 5}}>
        <Avatar
          alt="Remy Sharp"
          src="assets/icons/iligan-icon.jpg"
          sx={{ width: 100, height: 100 }}
        />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar
              src={avatarConfig()}
              alt="photoURL"
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                {`${
                  userData?.first_name?.charAt(0).toUpperCase() +
                  userData?.first_name?.slice(1)
                }
                  ${userData?.middle_name?.charAt(0).toUpperCase()}.
                  ${
                    userData?.last_name?.charAt(0).toUpperCase() +
                    userData?.last_name?.slice(1)
                  }`}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {userData?.role?.toUpperCase()}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>
      <NavSection navConfig={navConfigHandler()} />
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
