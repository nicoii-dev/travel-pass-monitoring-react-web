import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useCallback, useEffect } from "react";
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
import Page from "../../../../components/Page";
import Iconify from "../../../../components/Iconify";
import {
  FormProvider,
  RHFTextField,
  RHFDropDown,
  RHFDatePicker,
} from "../../../../components/hook-form";
import UserAddress from "./UserAddress";

// api
import userApi from "../../../../services/userApi";

// schema
import { UpdateUserSchema } from "../../../../yup-schema/updateUserSchema";

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

const civilStatusData = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "widowed", label: "Widowed" },
  { value: "divorced", label: "Divorced" },
  { value: "separated", label: "Separated" },
];

export default function TravelPassUser({ applicationDetails }) {
  const queryClient = useQueryClient();
  const user = useParams();
  const navigate = useNavigate();
  const [currentAddressData, setCurrentAddressData] = React.useState([]);
  const { updateUser } = userApi;

  const defaultValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: moment(new Date()).format("MM-DD-YYYY"),
    gender: "",
    civilStatus: "",
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

  const userDetailsHandler = useCallback(() => {
    reset({
      firstName:
        applicationDetails?.user?.first_name.charAt(0).toUpperCase() +
        applicationDetails?.user?.first_name.slice(1),
      middleName:
        applicationDetails?.user?.middle_name.charAt(0).toUpperCase() +
        applicationDetails?.user?.middle_name.slice(1),
      lastName:
        applicationDetails?.user?.last_name.charAt(0).toUpperCase() +
        applicationDetails?.user?.last_name.slice(1),
      phoneNumber: applicationDetails?.user?.phone_number,
      gender: applicationDetails?.user?.gender,
      civilStatus: applicationDetails?.user?.civil_status,
      dob: applicationDetails?.user?.applicationDetails?.user?.dob,
      role: applicationDetails?.user?.role,
      status: applicationDetails?.user?.status,
      email: applicationDetails?.user?.email,
      region: applicationDetails?.user?.current_address?.region,
      province: applicationDetails?.user?.current_address?.province,
      city: applicationDetails?.user?.current_address?.city_municipality,
      barangay: applicationDetails?.user?.current_address?.barangay,
      street: applicationDetails?.user?.current_address?.street,
      zipcode: applicationDetails?.user?.current_address?.zipcode,
    });
    setCurrentAddressData(applicationDetails?.user?.current_address);
  }, [applicationDetails, reset]);

  useEffect(() => {
    userDetailsHandler();
  }, [userDetailsHandler]);

  const { mutate: Update, isLoading: updateIsLoading } = useMutation(
    (payload) => updateUser(user.id, payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-users"]);
        toast.success("Updated successfully");
        navigate(-1);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  return (
    <>
      <div style={{ padding: 5, zIndex: 9999, marginBottom: 20 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 2, alignSelf: "flex-end" }}
        >
          User Details
        </Typography>
      </div>

      <FormProvider methods={methods} onSubmit={() => {}}>
        <Stack spacing={3}>
          <>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <img
                src="/assets/icons/admin.png"
                alt="/assets/icons/admin.png"
                loading="lazy"
                height={200}
                width={200}
                style={{ marginLeft: 50, marginRight: 50 }}
              />
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFTextField name="firstName" label="First name" disabled />
                  <RHFTextField name="middleName" label="Middle name" disabled />
                  <RHFTextField name="lastName" label="Last name" disabled />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFTextField name="email" label="Email address" disabled />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <RHFDatePicker
                name="dob"
                label="Date of Birth"
                type="date"
                sx={{ width: 700 }}
                disabled
              />
              <RHFDropDown
                name="gender"
                label="Gender"
                inputType="dropDown"
                dropDownData={genderData}
                disabled
              />
              <RHFDropDown
                name="civilStatus"
                label="Civil Status"
                dropDownData={civilStatusData}
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
  );
}
