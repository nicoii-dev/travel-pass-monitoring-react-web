import React, { useState } from "react";
import {
  Container,
  Breadcrumbs,
  Typography,
  Box,
  Stack,
  Button,
} from "@mui/material";
import styled from "@emotion/styled";
import { LoadingButton } from "@mui/lab";
// components
import DialogModal from "../../../components/DialogModal";
import Page from "../../../components/Page";
import UserPageProfile from "./UseProfile";
import SecurityForm from "./UpdatePassword";
import TravelPassTable from "./TravelPassTable";
import MedicalTable from "./MedicalApplicationsTable";
import { getLocalStorageItem } from "../../../utils/getLocalStorage";
import { USER } from "../../../utils/constants/user";

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
    marginTop: -50,
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: "100%",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(5, 5),
  marginTop: 50,
  borderRadius: 10,
  backgroundColor: "#F0ECCF",
}));

const ProfilePage = () => {
  const [crumb, setCrumb] = useState("profile");
  const [openMedical, setOpenMedical] = useState(false);
  const [openTravelPass, setOpenTravelPass] = useState(false);
  const userData = getLocalStorageItem(USER.USER_DATA);

  return (
    <Page title="Profile Page">
      <RootStyle>
        <Container>
          <ContentStyle>
            <div role="presentation" style={{ position: "relative" }}>
              <Breadcrumbs aria-label="breadcrumb">
                <Typography
                  underline="hover"
                  color="inherit"
                  onClick={() => {
                    setCrumb("profile");
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  Profile
                </Typography>
                <Typography
                  underline="hover"
                  color="inherit"
                  onClick={() => {
                    setCrumb("security");
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  Security
                </Typography>
              </Breadcrumbs>
              {userData.role.toLowerCase() === "police" ||
              userData.role.toLowerCase() === "medicalstaff" ? null : (
                <div style={{ position: "absolute", top: 0, right: 100 }}>
                  <LoadingButton
                    variant="contained"
                    color="warning"
                    onClick={() => {
                      setOpenMedical(true);
                    }}
                    sx={{ marginRight: 2, width: 150 }}
                    type="button"
                  >
                    Medical Applications
                  </LoadingButton>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setOpenTravelPass(true);
                    }}
                    sx={{ width: 150 }}
                    type="button"
                  >
                    Travel Pass Applications
                  </LoadingButton>
                </div>
              )}
            </div>
            <Box>
              {crumb === "profile" ? <UserPageProfile /> : <SecurityForm />}
            </Box>
          </ContentStyle>
        </Container>
      </RootStyle>
      <DialogModal
        open={openMedical}
        handleClose={() => {
          setOpenMedical(false);
        }}
        // title={'Delete User'}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
        width={"md"}
      >
        <MedicalTable />
        <Stack
          spacing={2}
          direction="row"
          sx={{ alignItems: "flex-end", justifyContent: "flex-end", mt: 7 }}
        >
          <Button
            variant="text"
            onClick={() => {
              setOpenMedical(false);
            }}
          >
            Close
          </Button>
        </Stack>
      </DialogModal>

      <DialogModal
        open={openTravelPass}
        handleClose={() => {
          setOpenTravelPass(false);
        }}
        // title={'Delete User'}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
        width={"md"}
      >
        <TravelPassTable />
        <Stack
          spacing={2}
          direction="row"
          sx={{ alignItems: "flex-end", justifyContent: "flex-end", mt: 7 }}
        >
          <Button
            variant="text"
            onClick={() => {
              setOpenTravelPass(false);
            }}
          >
            Close
          </Button>
        </Stack>
      </DialogModal>
    </Page>
  );
};

export default ProfilePage;
