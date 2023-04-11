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
import { ForgotPasswordSchema } from "../../../yup-schema/forgotPasswordSchema";

// api
import forgotPasswordApi from "../../../services/forgotPasswordApi";

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

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { forgotPassword } = forgotPasswordApi;

  const defaultValues = {
    email: "",
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate: resetUser, isLoading: forgotLoading } = useMutation((payload) => forgotPassword(payload),
    {
      onSuccess: (result) => {
        if(result?.data?.status == 422) {
            return toast.error(result.data.message);
           }
           toast.success(result.data.message);
      },
      onError: (error) => {
        toast.error('Something went wrong.');
      },
    }
  );

  const onSubmit = async (data) => {
    resetUser(data);
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
            <Typography variant="h4" gutterBottom sx={{ color: "#202020" }}>
              Forgot Password?
            </Typography>

            <Typography sx={{ color: "#202020", mb: 5 }}>
              Enter your email below.
            </Typography>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <RHFTextField name="email" label="Email address" />
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={forgotLoading}
                sx={{ marginTop: 5 }}
              >
                Send Password Reset Link
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
