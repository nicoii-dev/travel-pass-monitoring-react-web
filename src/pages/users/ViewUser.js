import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import moment from "moment/moment";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { styled } from "@mui/material/styles";
import {
  Box,
  Link,
  Container,
  Typography,
  Tooltip,
  IconButton,
  Breadcrumbs,
  Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import { FormProvider, RHFTextField } from "../../components/hook-form";

// api
import userApi from "../../services/userApi";

// schema
import { UpdateUserSchema } from "../../yup-schema/updateUserSchema";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
    marginTop: -150,
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: "60%",
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------
const genderData = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const statusData = [
  { value: '1', label: 'Activated' },
  { value: '0', label: 'Deactivated' },
];

const positionData = [
  { value: 'enforcer', label: 'Enforcer' },
  { value: 'admin', label: 'Admin' },
  { value: 'treasurer', label: 'Treasurer' },
];

export default function ViewUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState("details");
  const { updateUser } = userApi;
  const { user } = useSelector((store) => store.user);

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema ),
    // defaultValues,
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const { mutate: Update, isLoading: isLoad } = useMutation(
    (payload) => updateUser(user.id, payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-users"]);
        toast.success("Updated successfully");
        setIsLoading(false);
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
    // setIsLoading(true);
    const payload = {
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      gender: data.gender,
      phone_number: data.phoneNumber,
      dob: moment(data.dob).format("MM/DD/YYYY"),
      role: data.role,
      email: user.email,
      status: data.status,
    };
    await Update(payload);
  };

  return (
    <Page title="Register">
      <RootStyle>
        <Container>
          <ContentStyle>
            <div style={{ padding: 5, zIndex: 9999, marginBottom: 20 }}>
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
                Viewing User Account
              </Typography>

              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => setCurrentPage("details")}
                  style={{ cursor: "pointer" }}
                >
                  Account Details
                </Link>
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => setCurrentPage("security")}
                  style={{ cursor: "pointer" }}
                >
                  Security
                </Link>
              </Breadcrumbs>
            </div>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <>
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
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <RHFTextField
                      name="status"
                      label="Status"
                      inputType="dropDown"
                      dropDownData={statusData}
                    />
                  </Stack>
                </>
                <Stack direction="row" spacing={4}>
                  <Box width="100%">
                    <LoadingButton
                      fullWidth
                      size="large"
                      variant="contained"
                      loading={isLoading}
                      type="submit"
                    >
                      Update
                    </LoadingButton>
                  </Box>
                </Stack>
              </Stack>
            </FormProvider>

            <Typography
              variant="body2"
              align="center"
              sx={{ color: "text.secondary", mt: 3, alignSelf: "flex-start" }}
            >
              Traffic Violation Record @ 2023
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
