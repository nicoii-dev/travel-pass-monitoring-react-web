import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
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
import Iconify from "../../../components/Iconify";
import {
  FormProvider,
  RHFTextField,
  RHFDropDown,
  RHFDatePicker,
} from "../../../components/hook-form";
import UserAddress from "./UserAddress";
import { getLocalStorageItem } from "../../../utils/getLocalStorage";
import { USER } from "../../../utils/constants/user";

// api
import userApi from "../../../services/userApi";

// schema
import { UpdateUserSchema } from "../../../yup-schema/updateUserSchema";

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

export default function UserPageProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(null);
  const [currentAddressData, setCurrentAddressData] = React.useState([]);
  const { updateUser, viewUser } = userApi;
  const userData = getLocalStorageItem(USER.USER_DATA);
  const [edit, setEdit] = useState(false);

  const defaultValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: moment(new Date()).format("MM-DD-YYYY"),
    civilStatus: "single",
    gender: "",
    phoneNumber: "",
    role: "",
    status: "",
    email: "",
    region: "",
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
    (payload) => viewUser(userData.id),
    {
      onSuccess: (data) => {
        const {
          first_name,
          middle_name,
          last_name,
          gender,
          civil_status,
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
          civilStatus: civil_status,
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
  }, []);

  const { mutate: Update, isLoading: updateIsLoading } = useMutation(
    (payload) => updateUser(userData.id, payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-users"]);
        toast.success("Updated successfully");
        setIsLoading(false);
        setEdit(false)
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
        setIsLoading(false);
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
      role: data.role,
      status: data.status,
      email: data.email,
      current_street: data.street,
      current_barangay: data.barangay,
      current_city: data.city,
      current_province: data.province,
      current_region: data.region,
      current_zipcode: data.zipcode,
    };
    console.log(payload)
    await Update(payload);
  };

  return (
    <>
      {viewIsLoading ? (
        <CircularProgress sx={{ placeSelf: "center" }} />
      ) : (
        <>
          <div style={{ padding: 5, zIndex: 9999, marginBottom: 20 }}>
            <div style={{ position: "relative" }}>
              <Tooltip
                title="Edit"
                sx={{ position: "absolute", top: 0, right: 10 }}
              >
                <IconButton onClick={() => setEdit(true)}>
                  <Iconify
                    icon="material-symbols:edit"
                    sx={{ width: 30, height: 30 }}
                  />
                </IconButton>
              </Tooltip>
            </div>

            <Typography
              variant="h4"
              gutterBottom
              sx={{ mb: 2, alignSelf: "flex-end" }}
            >
              My Profile
            </Typography>
          </div>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                      <RHFTextField
                        name="firstName"
                        label="First name"
                        disabled={!edit}
                      />
                      <RHFTextField
                        name="middleName"
                        label="Middle name"
                        disabled={!edit}
                      />
                      <RHFTextField
                        name="lastName"
                        label="Last name"
                        disabled={!edit}
                      />
                    </Stack>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <RHFTextField
                        name="email"
                        label="Email address"
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
                    disabled={!edit}
                  />
                  <RHFDropDown
                    name="gender"
                    label="Gender"
                    inputType="dropDown"
                    dropDownData={genderData}
                    disabled={!edit}
                  />
                  <RHFDropDown
                    name="civilStatus"
                    label="Civil Status"
                    dropDownData={civilStatusData}
                    disabled={!edit}
                  />
                  <RHFTextField
                    name="phoneNumber"
                    label="Phone Number"
                    type="number"
                    disabled={!edit}
                  />
                </Stack>

                <UserAddress
                  edit={edit}
                  setValue={setValue}
                  currentAddressData={currentAddressData}
                />
              </>
              {edit ? (
                <Stack direction="row" spacing={4}>
                  <Box width="100%">
                    <LoadingButton
                      fullWidth
                      size="large"
                      variant="contained"
                      loading={updateIsLoading}
                      type="submit"
                    >
                      Update
                    </LoadingButton>
                  </Box>
                </Stack>
              ) : null}
            </Stack>
          </FormProvider>
        </>
      )}
    </>
  );
}
