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
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material";
import dayjs from "dayjs";
// components
import Iconify from "../../../components/Iconify";
import {
  FormProvider,
  RHFTextField,
  RHFDropDown,
  RHFDatePicker,
} from "../../../components/hook-form";
import useResponsive from "../../../hooks/useResponsive";
import Page from "../../../components/Page";

// schema
import { SignupSchema } from "../../../yup-schema/signupSchema";

// hooks
import { setLocalStorageItem } from "../../../utils/setLocalStorage";
import userApi from "../../../services/userApi";
import RegisterAddress from "./RegisterAddress";

// ----------------------------------------------------------------------
const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "grid",
  },
  backgroundColor: "#FFD700",
  height: "100%",
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

const civilStatusData = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "widowed", label: "Widowed" },
  { value: "divorced", label: "Divorced" },
  { value: "separated", label: "Separated" },
];

export default function Signup() {
  const navigate = useNavigate();
  const { register } = userApi;
  const smUp = useResponsive("up", "sm");
  const mdUp = useResponsive("up", "md");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailState, setEmail] = useState("");

  const defaultValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "male",
    civilStatus: "single",
    phoneNumber: "",
    region: 0,
    province: "",
    city: "",
    barangay: "",
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
      gender: data.gender,
      civil_status: data.civilStatus,
      phone_number: data.phoneNumber,
      dob: moment(data.dob).format("YYYY-MM-DD"),
      role: "lsi",
      current_street: data.street,
      current_barangay: data.barangay,
      current_city: data.city,
      current_province: data.province,
      current_region: data.region,
      current_zipcode: data.zipcode,
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
          maxWidth="md"
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

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFDropDown
                    name="gender"
                    label="Gender"
                    dropDownData={genderData}
                  />
                  <RHFDatePicker
                    name="dob"
                    label="Date of Birth"
                    type="date"
                    sx={{ width: 700 }}
                    maxDate={dayjs(new Date())}
                  />
                  <RHFDropDown
                    name="civilStatus"
                    label="Civil Status"
                    dropDownData={civilStatusData}
                  />
                  <RHFTextField
                    name="phoneNumber"
                    label="Phone Number"
                    type="number"
                  />
                </Stack>
                <RegisterAddress />
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
