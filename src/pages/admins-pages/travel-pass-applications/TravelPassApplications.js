import { filter, map } from "lodash";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

// material
import {
  Container,
  Tooltip,
  IconButton,
  Grid,
  Chip,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import AppTable from "../../components/table/AppTable";
import Calendar from "../../components/Calendar";
import DialogModal from "../../components/DialogModal";

// api
import medicalReservationApi from "../../services/medicalReservationApi";
import medicalStatusApi from "../../services/medicalStatusApi";

// redux
import { setAppointment } from "../../store/medicalAppointmentSlice";

// ----------------------------------------------------------------------

export default function TravelPassApplications() {
  const { getAppointments, setToVerified } = medicalReservationApi;
  const { getVerified, getMedicalApplications } = medicalStatusApi;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appointmentList, setAppointmentList] = useState([]);
  const [open, setOpen] = useState(false);

  const { userAppointment } = useSelector((store) => store.userAppointment);

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getTime = (time) => {
    switch (time) {
      case "1":
        return "8AM to 10AM";
      case "2":
        return "10AM to 12PM";
      case "3":
        return "1PM to 3PM";
      case "4":
        return "3PM to 5PM";
      default:
        break;
    }
  };

  const {
    data: medicalData,
    status: medicalStatus,
    isFetching: scheduleIsFetching,
  } = useQuery(["get-all-medical-applications"], () => getMedicalApplications(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (medicalStatus === "success") {
      setAppointmentList(
        medicalData.data.map((data) => ({
          id: data.id,
          referenceCode: data.status === "1" ? data.reference_code : "N/A",
          fullName: `${
            data.user.first_name.charAt(0).toUpperCase() +
            data.user.first_name.slice(1)
          } ${
            data.user.middle_name.charAt(0).toUpperCase() +
            data.user.middle_name.slice(1)
          } ${
            data.user.last_name.charAt(0).toUpperCase() +
            data.user.last_name.slice(1)
          }`,
          status: (
            <Chip
              label={data.status.toString() === "1" ? "Approved" : "Declined"}
              color={data.status.toString() === "1" ? "success" : "error"}
            />
          ),
          comment: data.comment,
          action: (
            <>
              <Tooltip title="View Profile">
                <IconButton
                  onClick={() => {
                    setUserHandler(data);
                  }}
                >
                  <Iconify icon="ic:baseline-remove-red-eye" />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Set to Appointed">
                <IconButton
                  onClick={() => {
                    dispatch(setAppointment(data));
                    openDialog();
                  }}
                  disabled={data.status !== "1"}
                >
                  <Iconify icon="ic:twotone-file-open" />
                </IconButton>
              </Tooltip> */}
            </>
          ),
        }))
      );
    }
  }, [medicalStatus, medicalData]);

  const setUserHandler = async (data) => {
    navigate(`/medical-applications/user/view/${data.user.id}`);
  };

  const { mutate: setAppointed, isLoading: verificationIsLoading } =
    useMutation(() => setToVerified(userAppointment.id), {
      onSuccess: (data) => {
        toast.success("Verified successfully");
        queryClient.invalidateQueries(["get-all-appointments"]);
        handleClose();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <AppTable
          tableTitle={"Medical Applications"}
          // buttonTitle={"New Application"}
          // buttonFunction={() => navigate("/medical-applications/create")}
          hasButton={false}
          TABLE_HEAD={[
            { id: "fullName", label: "Full Name", align: "center" },
            { id: "referenceCode", label: "Reference Code", align: "center" },
            { id: "status", label: "Status", align: "center" },
            { id: "comment", label: "Comment", align: "center" },
            { id: "action", label: "Action", align: "center" },
          ]}
          TABLE_DATA={appointmentList}
          // isLoading={scheduleIsLoading}
        />
      </Container>
      <DialogModal
        open={open}
        handleClose={handleClose}
        // title={'Delete User'}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
      >
        <Typography variant="h4" sx={{ mt: 1, textAlign: "center" }}>
          LSI medical application verified?
        </Typography>
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
            color="success"
            onClick={() => setAppointed()}
            loading={verificationIsLoading}
          >
            Yes
          </LoadingButton>
        </Stack>
      </DialogModal>
    </Page>
  );
}
