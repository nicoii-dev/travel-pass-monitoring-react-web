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
  Button,
  TextareaAutosize,
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
import DialogModal from "../../../../components/DialogModal";

// api
import userApi from "../../../../services/userApi";
import medicalApplicationApi from "../../../../services/medicalApplicationApi";

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

export default function MedicalUserProfile() {
  const queryClient = useQueryClient();
  const application = useParams();
  const navigate = useNavigate();
  const [medicalData, setMedicalData] = React.useState([]);
  const [currentAddressData, setCurrentAddressData] = React.useState([]);
  const { viewMedicalApplications, updateMedicalApplications } =
    medicalApplicationApi;
  const [open, setOpen] = useState(false);
  const [approved, setApproved] = useState(false);
  const [textAreaValue, setTextAreaValue] = React.useState("");

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
    (payload) => viewMedicalApplications(application.id),
    {
      onSuccess: (data) => {
        setMedicalData(data.data);
        reset({
          firstName:
            data?.data?.user?.first_name.charAt(0).toUpperCase() +
            data?.data?.user?.first_name.slice(1),
          middleName:
            data?.data?.user?.middle_name.charAt(0).toUpperCase() +
            data?.data?.user?.middle_name.slice(1),
          lastName:
            data?.data?.user?.last_name.charAt(0).toUpperCase() +
            data?.data?.user?.last_name.slice(1),
          phoneNumber: data?.data?.user?.phone_number,
          gender: data?.data?.user?.gender,
          dob: data?.data?.user?.dob,
          role: data?.data?.user?.role,
          status: data?.data?.user?.status,
          email: data?.data?.user?.email,
          region: data?.data?.user?.current_address?.region,
          province: data?.data?.user?.current_address?.province,
          city: data?.data?.user?.current_address?.city_municipality,
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

  const { mutate: Update, isLoading: updateIsLoading } = useMutation(
    (payload) => updateMedicalApplications(application.id, payload),
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

  const updateApplication = async () => {
    const payload = {
      status: approved ? "1" : "2",
      remarks: textAreaValue,
    };
    // console.log(payload)
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
                <div role="presentation" style={{ position: "relative" }}>
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
                      Viewing LSI Profile
                    </Typography>
                  </div>
                  <div style={{ position: "absolute", top: 10, right: 10 }}>
                    {medicalData?.status === "0" ? (
                      <>
                        <LoadingButton
                          variant="contained"
                          color="error"
                          onClick={() => {
                            setOpen(true);
                            setApproved(false);
                          }}
                          sx={{ marginRight: 2, width: 120 }}
                          type="button"
                        >
                          Decline
                        </LoadingButton>
                        <LoadingButton
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setOpen(true);
                            setApproved(true);
                          }}
                          sx={{ width: 120 }}
                          type="button"
                        >
                          Approve
                        </LoadingButton>
                      </>
                    ) : medicalData.status === "1" ? (
                      <Typography sx={{ color: "green", fontWeight: "bold" }}>
                        Approved Application
                      </Typography>
                    ) : (
                      <Typography sx={{ color: "red", fontWeight: "bold" }}>
                        Declined Application
                      </Typography>
                    )}
                  </div>
                </div>
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
      <DialogModal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        // title={'Delete User'}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
      >
        <Typography variant="h4" sx={{ mt: 1, textAlign: "center" }}>
          {`Are your sure you want to ${
            approved ? "APPROVE" : "DECLINE"
          } this application?`}
        </Typography>
        <TextareaAutosize
          style={{
            width: "100%",
            fontSize: 16,
            borderColor: "black",
            outline: "none",
            borderRadius: 5,
            height: 100,
            marginTop: 10,
          }}
          placeholder="Remarks"
          value={textAreaValue}
          onChange={(e) => {
            setTextAreaValue(e.target.value);
          }}
        />
        <Stack
          spacing={2}
          direction="row"
          sx={{ alignItems: "flex-end", justifyContent: "flex-end", mt: 7 }}
        >
          <Button
            variant="text"
            onClick={() => {
              setOpen(false);
              setTextAreaValue('');
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            variant="outlined"
            color={approved ? "success" : "error"}
            onClick={() => updateApplication()}
            loading={updateIsLoading}
          >
            Yes
          </LoadingButton>
        </Stack>
      </DialogModal>
    </Page>
  );
}
