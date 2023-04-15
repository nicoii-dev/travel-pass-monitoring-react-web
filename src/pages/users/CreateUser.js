import React, {useState} from 'react';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
// @mui
import { styled } from "@mui/material/styles";
import {
  Container,
  Typography,
  Tooltip,
  IconButton,
  Stack,
  InputAdornment,
  Box
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import { FormProvider, RHFTextField } from "../../components/hook-form";

// api
import userApi from '../../services/userApi';

// schema
import { CreateUserSchema } from '../../yup-schema/createUserSchema';


// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
    marginTop: -50,
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: "65%",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(5, 5),
  marginTop: 50,
  backgroundColor: '#F0ECCF'
}));

// ----------------------------------------------------------------------
const genderData = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'}
]

const positionData = [
  {value: 'police', label: 'Police'},
  {value: 'medicalStaff', label: 'Medical Staff'},
  {value: 'admin', label: 'Admin'},
]

export default function CreateUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { createUser } = userApi;

  const defaultValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: new Date(),
    gender: "male",
    role: "enforcer",
  };

  const methods = useForm({
    resolver: yupResolver(CreateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate: CreateUser, isLoading: isLoad } = useMutation(
    (payload) => createUser(payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-users"]);
        toast.success("Created successfully");
        setIsLoading(true);
        navigate(-1);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
        setIsLoading(false);
      },
    }
  );

  const onSubmit = async (data) => {
    console.log(data);
    setIsLoading(true);
    const payload = {
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      gender: data.gender,
      phone_number: data.phoneNumber,
      dob: moment(data.dob).format("MM/DD/YYYY"),
      role: data.role,
      email: data.email,
      password: data.confirmPassword,
    };
    await CreateUser(payload);
  };

  return (
    <Page title="Register">
      <RootStyle>
        <Container>
          <ContentStyle>
            <div style={{ padding: 5, zIndex: 9999 }}>
              <Tooltip title="View">
                <IconButton onClick={() => navigate(-1)}>
                  <Iconify
                    icon="ion:arrow-back-circle"
                    sx={{ width: 30, height: 30 }}
                  />
                </IconButton>
              </Tooltip>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ mb: 2, alignSelf: "flex-end" }}
              >
                Creating User Account
              </Typography>
            </div>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFTextField name="firstName" label="First name" />
                  <RHFTextField name="middleName" label="Last name" />
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
                    label="Phone Number"
                    type="number"
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFTextField
                    name="dob"
                    label="Date of Birth"
                    inputType="datePicker"
                  />
                  <RHFTextField
                    name="role"
                    label="Role"
                    inputType="dropDown"
                    dropDownData={positionData}
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

                <Stack direction="row" spacing={4}>
                  <Box width="100%">
                    <LoadingButton
                      fullWidth
                      size="large"
                      variant="contained"
                      loading={isLoading}
                      type="submit"
                    >
                      Create
                    </LoadingButton>
                  </Box>
                </Stack>
              </Stack>
            </FormProvider>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
