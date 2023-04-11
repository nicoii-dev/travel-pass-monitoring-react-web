import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// @mui
import { styled } from "@mui/material/styles";
import {
  Card,
  CircularProgress,
  Container,
  Typography,
  Box,
  Stack,
  Skeleton,
  CardContent
} from "@mui/material";
import Lottie from "react-lottie";

// components
import Page from "../components/Page";

// api
import userApi from "../services/userApi";

// animation
import Invalid from '../utils/assets/animation/invalid.json'
import Verified from '../utils/assets/animation/verified.json'
// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "50vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function EmailVerification() {
  const navigate = useNavigate();
  const { email, token } = useParams();
  const { verifyEmail } = userApi;
  const [verifyStatus, setVerifyStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        const response = await verifyEmail(token.replace("token=", ""), {
          email: email,
        });
        setTimeout(() => {
          navigate("/signin");
        }, 3500);
      } catch (e) {
        console.log(e);
        setVerifyStatus(true);
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <Page title="Email Verification">
      <RootStyle>
        <Container maxWidth="sm">
          <Card sx={{ marginTop: 10 }}>
            <ContentStyle>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  {isLoading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Stack>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "3rem", width: 800 }}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={800}
                          height={360}
                        />
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "2rem", width: 800 }}
                        />
                      </Stack>
                    </Box>
                  ) : (
                    <Box>
                      {verifyStatus ? (
                        <Box>
                          <Typography variant="h3" color="#A62349">
                            Invalid Verification
                          </Typography>
                          <Lottie
                            options={{
                              loop: true,
                              autoplay: true,
                              animationData: Invalid,
                              rendererSettings: {
                                preserveAspectRatio: "xMidYMid slice",
                              },
                              isClickToPauseDisabled: true,
                            }}
                            height={400}
                            width={400}
                          />
                          <Typography variant="p" color="gray">
                            Cannot verify email something went wrong
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'grid',justifyItems: 'center'}}>
                          <Typography variant="h3" color="#54BAB9">
                            Account Verified
                          </Typography>
                          <Lottie
                            options={{
                              loop: true,
                              autoplay: true,
                              animationData: Verified,
                              rendererSettings: {
                                preserveAspectRatio: "xMidYMid slice",
                              },
                              isClickToPauseDisabled: true,
                            }}
                            height={400}
                            width={400}
                          />
                          <Typography variant="p" color="gray">
                            Account has been verified redirecting to Login page
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </ContentStyle>
          </Card>
        </Container>
      </RootStyle>
    </Page>
  );
}
