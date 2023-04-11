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
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

const genderData = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];
  

export default function Signup() {
  const navigate = useNavigate();
  const {register} = userApi;
  const smUp = useResponsive("up", "sm");
  const mdUp = useResponsive("up", "md");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
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
        setLocalStorageItem("userToken", data.data.token, 9999);
        setLocalStorageItem("userData", data.data.user, 9999);
        navigate(`/login`);
        toast.success('Registration is successfull. Please check your email to verify.');
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      gender: data.gender,
      phone_number: data.phoneNumber,
      role: data.role,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword
    }
    registerUser(payload);
  };

  return (
    <Page title="Register">
      <RootStyle>
        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Manage your laundry more effectively with Laundry Service Locator
            </Typography>
            <img
              alt="register"
              src="/static/laundry-shop.png"
              style={{ height: 300, width: 300, alignSelf: "center" }}
            />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Get started absolutely free.
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 5 }}></Typography>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFTextField name="firstName" label="First name" />
                  <RHFTextField name="lastName" label="Last name" />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFTextField
                    name="gender"
                    label="Gender"
                    inputType="dropDown"
                    dropDownData={genderData}
                  />
                  <RHFTextField
                    name="phoneNumber"
                    label="Phone number"
                    type="number"
                    placeholder="09XX XXX XXXX"
                  />
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
                <Link variant="subtitle2" component={RouterLink} to="/login">
                  Login
                </Link>
              </Typography>
            )}

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
                Already have an account?{" "}
                <Link variant="subtitle2" to="/login" component={RouterLink}>
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
