import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useEffect } from "react";
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
  CircularProgress,
  Avatar,
} from "@mui/material";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";
// components
import Page from "../../../components/Page";
import Iconify from "../../../components/Iconify";
import {
  FormProvider,
  RHFTextField,
  RHFDropDown,
  RHFDatePicker,
} from "../../../components/hook-form";
import UserAddress from "./UserAddress";

// api
import userApi from "../../../services/userApi";

// schema
import { UpdateUserSchema } from "../../../yup-schema/updateUserSchema";

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

export default function UserProfileViewOnly() {
  const queryClient = useQueryClient();
  const user = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(null);
  const [currentAddressData, setCurrentAddressData] = React.useState([]);
  const { updateUser, viewUser } = userApi;

  const defaultValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: moment(new Date()).format("MM-DD-YYYY"),
    gender: "",
    phoneNumber: "",
    role: "",
    status: "",
    email: "",
    region: 0,
    province: "",
    city: "",
    barangay: "",
    street: "",
    zipcode: "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, isDirty, isValid },
  } = methods;

  const { mutate: View, isLoading: viewIsLoading } = useMutation(
    (payload) => viewUser(user.id),
    {
      onSuccess: (data) => {
        const {
          first_name,
          middle_name,
          last_name,
          gender,
          dob,
          phone_number,
          role,
          status,
          email,
        } = data?.data;

        reset({
          firstName: first_name.charAt(0).toUpperCase() + first_name.slice(1),
          middleName: middle_name.charAt(0).toUpperCase() + first_name.slice(1),
          lastName: last_name.charAt(0).toUpperCase() + first_name.slice(1),
          phoneNumber: phone_number,
          gender,
          dob,
          role,
          status,
          email,
          region: data?.data?.current_address?.region,
          province: data?.data?.current_address?.province,
          city: data?.data?.current_address?.city_municipality,
          barangay: data?.data?.current_address?.barangay,
          street: data?.data?.current_address?.street,
          zipcode: data?.data?.current_address?.zipcode,
        });
        setCurrentAddressData(data?.data?.current_address);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  useEffect(() => {
    View();
  }, [View, user]);

  const { mutate: Update, isLoading: updateIsLoading } = useMutation(
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
    console.log(data);
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
    await Update(payload);
  };

  return (
    <Page title="View User">
      <RootStyle>
        <Container>
          <ContentStyle>
            {viewIsLoading ? (
              <CircularProgress sx={{ placeSelf: "center" }} />
            ) : (
              <>
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
                </div>

                <FormProvider
                  methods={methods}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Stack spacing={3}>
                    <>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <img
                          src="/assets/icons/admin.png"
                          alt="/assets/icons/admin.png"
                          loading="lazy"
                          height={200}
                          width={200}
                          style={{ marginLeft: 50, marginRight: 50 }}
                        />
                        <Stack spacing={3}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                          >
                            <RHFTextField name="firstName" label="First name" disabled/>
                            <RHFTextField
                              name="middleName"
                              label="Middle name"
                              disabled
                            />
                            <RHFTextField name="lastName" label="Last name" disabled/>
                          </Stack>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                          >
                            <RHFTextField name="email" label="Email address" disabled/>
                          </Stack>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                          >
                            <RHFDropDown
                              name="role"
                              label="Role"
                              dropDownData={positionData}
                              disabled
                            />
                            <RHFDropDown
                              name="status"
                              label="Status"
                              dropDownData={statusData}
                              disabled
                            />
                          </Stack>
                        </Stack>
                      </Stack>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <RHFDatePicker
                          name="dob"
                          label="Date of Birth"
                          type="date"
                          sx={{ width: 500 }}
                          disabled
                        />
                        <RHFDropDown
                          name="gender"
                          label="Gender"
                          inputType="dropDown"
                          dropDownData={genderData}
                          disabled
                        />
                        <RHFTextField
                          name="phoneNumber"
                          label="Phone Number"
                          type="number"
                          disabled
                        />
                      </Stack>

                      <UserAddress
                        setValue={setValue}
                        currentAddressData={currentAddressData}
                      />
                    </>
                  </Stack>
                </FormProvider>
              </>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
