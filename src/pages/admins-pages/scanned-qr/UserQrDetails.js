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
import travelPassApplicationApi from "../../../services/travelPassApplicationApi";

// schema
import { UpdateUserSchema } from "../../../yup-schema/updateUserSchema";
import _ from "lodash";

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

export default function UserQrDetails() {
  const queryClient = useQueryClient();
  const application = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(null);
  const [currentAddressData, setCurrentAddressData] = React.useState([]);
  const { viewQrDetails } = travelPassApplicationApi;
  const [qrData, setQrData] = useState([]);

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
    () => viewQrDetails(application.id),
    {
      onSuccess: (data) => {
        setQrData(data.data);
        reset({
          startDate: moment(data?.data?.start_date).format("MMMM-DD-YYYY"),
          expiryDate: moment(data?.data?.end_date).format("MMMM-DD-YYYY"),
          status: data?.data?.status === "1" ? "ACTIVE" : "EXPIRED",
          firstName:
            data?.data?.user?.first_name?.charAt(0).toUpperCase() +
            data?.data?.user?.first_name?.slice(1),
          middleName:
            data?.data?.user?.middle_name?.charAt(0).toUpperCase() +
            data?.data?.user?.middle_name?.slice(1),
          lastName:
            data?.data?.user?.last_name?.charAt(0).toUpperCase() +
            data?.data?.user?.last_name?.slice(1),
          phoneNumber: data?.data?.user?.phone_number,
          gender: data?.data?.user?.phone_number,
          dob: data?.data?.user?.date_of_birhth,
          role: data?.data?.user?.role,
          userStatus: data?.data?.user?.status,
          email: data?.data?.user?.email,
          region: data?.data?.user?.current_address?.region,
          province: data?.data?.user?.current_address?.province,
          city: data?.data.user?.current_address?.city_municipality,
          barangay: data?.data?.user?.current_address?.barangay,
          street: data?.data?.user?.current_address?.street,
          zipcode: data?.data?.user?.current_address?.zipcode,
        });
        setCurrentAddressData(data?.data?.user?.current_address);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  useEffect(() => {
    View();
  }, [View, application]);
  console.log(_.isEmpty(qrData));
  return (
    <Page title="View User">
      <RootStyle>
        <Container>
          <ContentStyle>
            {viewIsLoading ? (
              <CircularProgress sx={{ placeSelf: "center" }} />
            ) : (
              <>
                {_.isEmpty(qrData) ? (
                  <Typography sx={{alignSelf: 'center', fontSize: 24, fontFamily: "monospace"}}>There is no QR details with this ID</Typography>
                ) : (
                  <FormProvider methods={methods} onSubmit={() => {}}>
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
                              <RHFTextField
                                name="firstName"
                                label="First name"
                                disabled
                              />
                              <RHFTextField
                                name="middleName"
                                label="Middle name"
                                disabled
                              />
                              <RHFTextField
                                name="lastName"
                                label="Last name"
                                disabled
                              />
                            </Stack>
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={2}
                            >
                              <RHFTextField
                                name="email"
                                label="Email address"
                                disabled
                              />
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
                                name="userStatus"
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
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                        >
                          <RHFTextField
                            name="startDate"
                            label="Start Date"
                            disabled
                          />
                          <RHFTextField
                            name="expiryDate"
                            label="Expiry Date"
                            disabled
                          />
                          <RHFTextField name="status" label="Status" disabled />
                        </Stack>
                      </>
                    </Stack>
                  </FormProvider>
                )}
              </>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
