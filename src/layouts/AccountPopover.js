import { useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import moment from "moment";
// @mui
import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import MenuPopover from "../components/MenuPopover";
import { getLocalStorageItem } from "../utils/getLocalStorage";
import DialogModal from "../components/DialogModal";
import { USER } from "../utils/constants/user";
import QrCodePage from "../pages/users-pages/profile/QrCode";

// api
import userApi from "../services/userApi";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "My QR",
    icon: "eva:person-fill",
    linkTo: "#",
  },
];
const adminAvatar = "/assets/icons/admin.png";
const policeAvatar = "/assets/icons/policeman.png";
const medicalStaffAvatar = "/assets/icons/nurse.png";
const userAvatar = "/assets/icons/man.png";
// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [openQr, setOpenQr] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const queryClient = useQueryClient();
  const { logout } = userApi;

  const [qrDetails, setQrDetails] = useState([]);

  const userData = getLocalStorageItem(USER.USER_DATA);

  const { mutate: logOut, isLoading: logOutLoading } = useMutation(
    () => logout(),
    {
      onSettled: () => {
        localStorage.removeItem(USER.ACCESS_TOKEN);
        localStorage.removeItem(USER.USER_DATA);
        queryClient.clear();
        navigate("/signin", { replace: true });
      },
    }
  );

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
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

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={avatarConfig()} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
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
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {userData?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />
        {userData.role === "lsi" ? (
          <Stack sx={{ p: 1 }}>
            {MENU_OPTIONS.map((option) => (
              <MenuItem
                key={option.label}
                to={option.linkTo}
                component={RouterLink}
                onClick={() => {
                  setOpenQr(true);
                  handleClose()
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Stack>
        ) : null}

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem
          onClick={() => {
            setOpen(null);
            setLogoutModal(true);
          }}
          sx={{ m: 1 }}
        >
          Logout
        </MenuItem>
      </MenuPopover>

      <DialogModal
        open={openQr}
        handleClose={() => {
          setOpenQr(false);
        }}
        title={`Expiry Date: ${moment(qrDetails?.data?.end_date).format(
          "MMMM-DD-YYYY"
        )}`}
        subtitle={`Start Date: ${moment(qrDetails?.data?.start_date).format(
          "MMMM-DD-YYYY"
        )}`}
        buttons
      >
        <QrCodePage qrDetails={qrDetails} setQrDetails={setQrDetails} />
        <Stack
          spacing={2}
          direction="row"
          sx={{ alignItems: "flex-end", justifyContent: "flex-end", mt: 7 }}
        >
          <Button variant="text" onClick={() => setOpenQr(false)}>
            Close
          </Button>
        </Stack>
      </DialogModal>

      <DialogModal
        open={logoutModal}
        handleClose={() => {
          setLogoutModal(false);
        }}
        // title={'Delete User'}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
      >
        <Typography variant="h4" sx={{ mt: 1, textAlign: "center" }}>
          Are you sure you want to logout?
        </Typography>
        <Stack
          spacing={2}
          direction="row"
          sx={{ alignItems: "flex-end", justifyContent: "flex-end", mt: 7 }}
        >
          <Button variant="text" onClick={() => setLogoutModal(false)}>
            Cancel
          </Button>

          <LoadingButton
            variant="outlined"
            color="error"
            onClick={() => logOut()}
            loading={logOutLoading}
          >
            Yes
          </LoadingButton>
        </Stack>
      </DialogModal>
    </>
  );
}
