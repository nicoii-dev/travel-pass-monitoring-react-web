import * as Yup from "yup";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Stack,
  IconButton,
  InputAdornment,
  Card,
  Typography,
  Container,
  Link,
  Box,
  Avatar,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material";
// components
import Iconify from "../../../components/Iconify";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import useResponsive from "../../../hooks/useResponsive";
import Page from "../../../components/Page";

// schema
import { SignupSchema } from "../../../yup-schema/signupSchema";

// hooks
import { setLocalStorageItem } from "../../../utils/setLocalStorage";
import userApi from "../../../services/userApi";

// ----------------------------------------------------------------------
const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
  backgroundColor: "#FFD700",
  height: "100vh",
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(-10, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  minHeight: "60vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(2, 0),
}));

const genderData = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function Signup() {
  const navigate = useNavigate();
  const { register } = userApi;
  const smUp = useResponsive("up", "sm");
  const mdUp = useResponsive("up", "md");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailState, setEmail] = useState('');

  const defaultValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const methods = useForm({
    resolver: yupResolver(SignupSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate: registerUser, isLoading: loginUserLoading } = useMutation(
    (payload) => register(payload),
    {
      onSuccess: (data) => {
        navigate("/email-verify");
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    const payload = {
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      role: "user",
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
    };
    registerUser(payload);
  };

  return (
    <Page title="Register">
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
            <Typography variant="h4" gutterBottom>
              Creating your account.
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 5 }}></Typography>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFTextField name="firstName" label="First name" />
                  <RHFTextField name="middleName" label="Middle name" />
                  <RHFTextField name="lastName" label="Last name" />
                </Stack>
                <RHFTextField name="email" label="Email address" />
                <RHFTextField
                  name="password"
                  label="Password"
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

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={loginUserLoading}
                >
                  Register
                </LoadingButton>
              </Stack>
            </FormProvider>

            {smUp && (
              <Typography variant="body2" sx={{ mt: 3, alignSelf: "end" }}>
                Already have an account? {""}
                <Link variant="subtitle2" component={RouterLink} to="/signin">
                  Login
                </Link>
              </Typography>
            )}

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
                Already have an account?{" "}
                <Link variant="subtitle2" to="/signin" component={RouterLink}>
                  Login
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
