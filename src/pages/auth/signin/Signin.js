import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
// forms
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
// components
import Page from "../../../components/Page";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import Iconify from "../../../components/Iconify";
import { setLocalStorageItem } from "../../../utils/setLocalStorage";
import { USER } from "../../../utils/constants/user";

// schema
import { LoginSchema } from "../../../yup-schema/loginSchema";

// api
import userApi from "../../../services/userApi";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
  // backgroundImage: `url(${'assets/background/background2.jpg'})`,
  // backgroundPosition: 'center',
  // // backgroundSize: 'cover',
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

export default function Signin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = userApi;

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate: loginUser, isLoading: loginUserLoading } = useMutation(
    (payload) => login(payload),
    {
      onSuccess: (data) => {
        setLocalStorageItem(USER.ACCESS_TOKEN, data.data.token, 9999);
        setLocalStorageItem(USER.USER_DATA, data.data.user, 9999);
        navigate(`/`);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    loginUser(data);
    // navigate('/dashboard')
  };

  return (
    <Page title="Signin">
      <svg
        width="500"
        height="80"
        viewBox="0 0 500 80"
        preserveAspectRatio="none"
        style={{ width: "100%", position: 'absolute', top: 0, height: 200 }}
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
            zIndex: 999
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
            <Typography variant="h5" gutterBottom sx={{ color: "#202020" }}>
              Welcome to
            </Typography>
            <Typography variant="h4" gutterBottom sx={{ color: "#202020" }}>
              Travel Pass Monitoring App
            </Typography>

            <Typography sx={{ color: "#202020", mb: 5 }}>
              Enter your credentials below.
            </Typography>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <RHFTextField name="email" label="Email address" />

                <RHFTextField
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
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
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                sx={{ my: 2 }}
              >
                <Link
                  rel="noopener"
                  variant="subtitle2"
                  underline="hover"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/forgot-password");
                  }}
                >
                  Forgot password?
                </Link>
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={loginUserLoading}
                sx={{ marginTop: 5 }}
              >
                Login
              </LoadingButton>
            </FormProvider>

            <Typography
              variant="body2"
              sx={{ mb: 0, mt: 5, cursor: "pointer", color: "#202020" }}
            >
              Don’t have an account? {""}
              <Link variant="subtitle2" href="signup">
                Get started
              </Link>
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
