import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { toast } from "react-toastify";
import moment from "moment/moment";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { styled } from "@mui/material/styles";
import {
  Box,
  Container,
  Typography,
  Tooltip,
  IconButton,
  Stack,
  CircularProgress,
  Button,
  TextareaAutosize,
} from "@mui/material";
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
import DialogModal from "../../../components/DialogModal";

// api
import userApi from "../../../services/userApi";
import medicalStatusApi from "../../../services/medicalStatusApi";
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

export default function UserProfile() {
  const queryClient = useQueryClient();
  const user = useParams();
  const navigate = useNavigate();
  const [currentAddressData, setCurrentAddressData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [statusText, setStatusText] = React.useState("");
  const [textAreaValue, setTextAreaValue] = React.useState("");
  const { updateUser, viewUser } = userApi;
  const { createMedicalApplications, getMedicalApplications } =
    medicalStatusApi;

  const { userAppointment } = useSelector((store) => store.userAppointment);

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    data: medicalData,
    status: medicalStatus,
    isFetching: scheduleIsFetching,
  } = useQuery(
    ["get-all-medical-applications"],
    () => getMedicalApplications(),
    {
      retry: 3, // Will retry failed requests 10 times before displaying an error
    }
  );

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

  const { mutate: UpdateApplication, isLoading: updateIsLoading } = useMutation(
    (payload) => createMedicalApplications(payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-medical-applications"]);
        toast.success("Updated successfully");
        navigate(-1);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  const CreateMedicalStatus = (data) => {
    const payload = {
      appointment_id: userAppointment?.id?.toString(),
      user_id: user.id.toString(),
      status: data,
      comment: textAreaValue,
    };
    console.log(payload);
    UpdateApplication(payload);
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

                    {medicalData?.data?.map(
                      (data) => data.id === userAppointment.id
                    )[0] ? null : (
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        sx={{ justifyContent: "flex-end" }}
                        spacing={2}
                      >
                        <Box>
                          <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            type="button"
                            onClick={() => {
                              openDialog();
                              setStatusText("Approve");
                            }}
                          >
                            Approve
                          </Button>
                        </Box>
                        <Box>
                          <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            type="button"
                            color="error"
                            onClick={() => {
                              openDialog();
                              setStatusText("Decline");
                            }}
                          >
                            Decline
                          </Button>
                        </Box>
                      </Stack>
                    )}
                  </Stack>
                </FormProvider>
              </>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>

      <DialogModal
        open={open}
        handleClose={handleClose}
        title={`You are about to ${statusText.toLocaleUpperCase()} this application.`}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
      >
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
          placeholder="Leave a comment"
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
          <Button variant="text" onClick={() => handleClose()}>
            Cancel
          </Button>
          <LoadingButton
            variant="outlined"
            color={
              statusText.toLocaleLowerCase() === "approve" ? "success" : "error"
            }
            onClick={() =>
              CreateMedicalStatus(
                statusText.toLocaleLowerCase() === "approve" ? "1" : "0"
              )
            }
            loading={updateIsLoading}
          >
            {statusText}
          </LoadingButton>
        </Stack>
      </DialogModal>
    </Page>
  );
}
