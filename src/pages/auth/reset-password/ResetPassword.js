import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import {
  Card,
  Container,
  Typography,
  Link,
  Stack,
  IconButton,
  InputAdornment,
  Avatar,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Lottie from "react-lottie";
// forms
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
// components
import Page from "../../../components/Page";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import Iconify from "../../../components/Iconify";

// schema
import { ResetPasswordSchema } from "../../../yup-schema/resetPasswordSchema";

// api
import forgotPasswordApi from "../../../services/forgotPasswordApi";

// animation
import Countdown from '../../../utils/assets/animation/countdown.json';

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
  backgroundColor: "#FFD700",
  height: "100vh",
}));

const ContentStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  minHeight: "60vh",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2, 0),
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const navigate = useNavigate();
  const { resetPassword } = forgotPasswordApi;
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);

  const defaultValues = {
    email: "",
  };

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate: resetUser, isLoading: forgotLoading } = useMutation(
    (payload) => resetPassword(payload),
    {
      onSuccess: (result) => {
        if (result?.data?.status == 422) {
          return toast.error(result.data.message);
        }
        setIsNavigate(true);
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
        toast.success(result.data.message);
      },
      onError: (error) => {
        toast.error("Something went wrong.");
      },
    }
  );

  const onSubmit = async (data) => {
    const payload = {
      token: searchParams.get("token"),
      email: searchParams.get("email"),
      password: data.newPassword,
      password_confirmation: data.confirmPassword,
    };
    resetUser(payload);
    // navigate('/dashboard')
  };

  return (
    <Page title="Signin">
      <svg
        width="500"
        height="80"
        viewBox="0 0 500 80"
        preserveAspectRatio="none"
        style={{ width: "100%", position: "absolute", top: 0, height: 200 }}
      >
        <path d="M0,0 L0,40 Q250,80 500,40 L500,0 Z" fill="black" />
      </svg>
      <RootStyle>
        <Container
          maxWidth="sm"
          sx={{
            mt: 5,
            mb: 15,
            padding: 5,
            borderRadius: 2,
            backgroundColor: "white",
            zIndex: 999,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar
              alt="Remy Sharp"
              src="assets/icons/iligan-icon.jpg"
              sx={{ width: 150, height: 150 }}
            />
          </Box>

          <ContentStyle>
            <Typography variant="h4" gutterBottom sx={{ color: "#202020" }}>
              Reset your Password
            </Typography>

            <Typography sx={{ color: "#202020", mb: 5 }}>
              Enter your new password below.
            </Typography>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <RHFTextField
                  name="newPassword"
                  label="New password"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Iconify
                            icon={
                              showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <RHFTextField
                  name="confirmPassword"
                  label="Confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          <Iconify
                            icon={
                              showConfirmPassword
                                ? "eva:eye-fill"
                                : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={forgotLoading}
                sx={{ marginTop: 5 }}
              >
                Reset
              </LoadingButton>
            </FormProvider>

            <Typography
              variant="body2"
              sx={{ mb: 0, mt: 5, cursor: "pointer", color: "#202020" }}
            >
              <Link variant="subtitle2" href="signin">
                Go back
              </Link>
            </Typography>
            {isNavigate ? 
            <Typography
              variant="body2"
              sx={{ mb: 0, mt: 5, cursor: "pointer", textAlign: 'center' }}
            >
              <Link variant="subtitle2" href="signin" sx={{color: 'black'}}>
                Navigating to Signin page...
              </Link>
            </Typography>
            : null
            }
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
