/* eslint-disable camelcase */
import { useLocation } from "react-router";
// @mui
import { styled } from "@mui/material/styles";
import {
  Container,
  Stack,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";

import VerifyEmail from "../utils/assets/svg/VerifyEmail";
// ----------------------------------------------------------------------

const ContentStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function EmailVerify() {
  return (
    <ContentStyle>
      <Container style={{ textAlign: "center" }}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Box>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Box sx={{ height: 200, width: 200 }}>
                  <VerifyEmail />
                </Box>
              </Box>

              <Box marginY={2}>
                <Typography variant="h3" color="#2065D1">
                  Verify your email
                </Typography>
              </Box>

              <Box display="flex" justifyContent="center" alignItems="center">
                <Stack alignContent="center" width="100%" spacing={4}>
                  <Typography variant="p" color="black">
                    Please verify your email address
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ContentStyle>
  );
}
