import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Breadcrumbs,
  Chip,
  Link,
  Typography,
  Box,
} from "@mui/material";
import styled from "@emotion/styled";

// components
import Page from "../../../components/Page";
import Iconify from "../../../components/Iconify";
import UserPageProfile from "./UseProfile";
import SecurityForm from "./UpdatePassword";

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

  return (
    <Page title="Profile Page">
      <RootStyle>
        <Container>
          <ContentStyle>
            <div role="presentation">
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
            </div>

            <Box>
              {crumb === "profile" ? <UserPageProfile /> : <SecurityForm />}
            </Box>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
};

export default ProfilePage;
