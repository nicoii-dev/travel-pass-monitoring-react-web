import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import moment from "moment";
// @mui
import { styled } from "@mui/material/styles";
import {
  Container,
  Typography,
  Tooltip,
  IconButton,
  Stack,
  InputAdornment,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import Page from "../../../components/Page";
import Iconify from "../../../components/Iconify";
import {
  FormProvider,
  RHFTextField,
  RHFDropDown,
  RHFDatePicker,
} from "../../../components/hook-form";

// api
import userApi from "../../../services/userApi";

// schema
import { CreateUserSchema } from "../../../yup-schema/createUserSchema";
import CreateCurrentAddress from "./CreateCurrentAddress";

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------
const genderData = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const statusData = [
  { value: "1", label: "Activated" },
  { value: "0", label: "Deactivated" },
];

const positionData = [
  { value: "police", label: "Police" },
  { value: "medicalStaff", label: "Medical Staff" },
  { value: "admin", label: "Admin" },
];

export default function CreateUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { createUser } = userApi;

  const defaultValues = {
    firstName: "aa",
    middleName: "bb",
    lastName: "cc",
    dob: dayjs(new Date()),
    gender: "male",
    phoneNumber: "09354135541",
    role: "admin",
    status: 1,
    region: 0,
    province: "",
    city: "",
    barangay: "",
  };

  const methods = useForm({
    resolver: yupResolver(CreateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const { mutate: CreateUser, isLoading: isCreateLoading } = useMutation(
    (payload) => createUser(payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-users"]);
        toast.success("Created successfully");
        navigate(-1);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    const payload = {
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      gender: data.gender,
      phone_number: data.phoneNumber,
      dob: moment(data.dob).format("YYYY-MM-DD"),
      role: data.role,
      status: data.status,
      email: data.email,
      current_street: data.street,
      current_barangay: data.barangay,
      current_city: data.city,
      current_province: data.province,
      current_region: data.region,
      current_zipcode: data.zipcode,
      permanent_street: data.street,
      permanent_barangay: data.barangay,
      permanent_city: data.city,
      permanent_province: data.province,
      permanent_region: data.region,
      permanent_zipcode: data.zipcode,
    };
    await CreateUser(payload);
  };

  return (
    <Page title="Register">
      <RootStyle>
        <Container>
          <ContentStyle>
            <div style={{ padding: 5, zIndex: 0 }}>
              <IconButton onClick={() => navigate(-1)}>
                <Iconify
                  icon="ion:arrow-back-circle"
                  sx={{ width: 30, height: 30 }}
                />
              </IconButton>
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
                  <RHFDropDown
                    name="gender"
                    label="Gender"
                    dropDownData={genderData}
                  />
                  <RHFTextField
                    name="phoneNumber"
                    label="Phone Number"
                    type="number"
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFDatePicker
                    name="dob"
                    label="Date of Birth"
                    type="date"
                    sx={{ width: 500 }}
                  />
                  <RHFDropDown
                    name="role"
                    label="Role"
                    dropDownData={positionData}
                  />
                  <RHFDropDown
                    name="status"
                    label="Status"
                    dropDownData={statusData}
                  />
                </Stack>

                <RHFTextField name="email" label="Email address" />

                <CreateCurrentAddress setValue={setValue} />

                <Stack direction="row" spacing={4}>
                  <Box width="100%">
                    <LoadingButton
                      fullWidth
                      size="large"
                      variant="contained"
                      loading={isCreateLoading}
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
