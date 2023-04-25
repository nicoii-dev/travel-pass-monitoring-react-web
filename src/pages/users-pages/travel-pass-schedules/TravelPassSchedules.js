import { filter, map } from "lodash";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import moment from "moment";

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
import Page from "../../../components/Page";
import Iconify from "../../../components/Iconify";
import AppTable from "../../../components/table/AppTable";
import Calendar from "../../../components/Calendar";
import DialogModal from "../../../components/DialogModal";

// api
import schedulesApi from "../../../services/schedulesApi";
import travelPassReservationApi from "../../../services/travelPassReservationApi";
import ApplicationForm from "./ApplicationForm";

// ----------------------------------------------------------------------

export default function TravelPassSchedules() {
  const { getTravelPassSchedulesByDate } = schedulesApi;
  const { createReservation, getUserSchedules } = travelPassReservationApi;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [scheduleList, setScheduleList] = useState([]);
  const [userSchedules, setUserSchedules] = useState([]);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [scheduleId, setScheduleId] = useState("");

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
    data: userScheduleData,
    status: userScheduleStatus,
    isFetching: scheduleIsFetching,
  } = useQuery(["get-all-user-travel-schedules"], () => getUserSchedules(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (userScheduleStatus === "success") {
      setUserSchedules(
        userScheduleData.data.map((data) => ({
          id: data.id,
          scheduleDate: moment(data.schedule.schedule_date).format(
            "MMMM-DD-YYYY"
          ),
          scheduleTime: getTime(data.schedule.schedule_time),
          referenceCode: data.reference_code,
          status: (
            <Chip
              label={
                data.status.toString() === "1"
                  ? "Active"
                  : data.status.toString() === "2"
                  ? "Verified"
                  : "Expired"
              }
              color={
                data.status.toString() === "1"
                  ? "success"
                  : data.status.toString() === "2"
                  ? "info"
                  : "error"
              }
            />
          ),
        }))
      );
    }
  }, [userScheduleData, userScheduleStatus]);

  const { mutate: createSched, isLoading: createReservationIsLoading } =
    useMutation((payload) => createReservation(payload), {
      onSuccess: (result) => {
        queryClient.invalidateQueries(["get-all-user-travel-schedules"]);
        toast.success(result?.data?.message);
        GetSchedule({ schedule_date: date });
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.response?.data?.message);
      },
    });

  const { mutate: GetSchedule, isLoading: scheduleIsLoading } = useMutation(
    (payload) => getTravelPassSchedulesByDate(payload),
    {
      onSuccess: (result) => {
        setScheduleList(
          result.data.map((data) => ({
            id: data.id,
            scheduleDate: moment(data.schedule_date).format("MMMM-DD-YYYY"),
            scheduleTime: getTime(data.schedule_time),
            maxLsi: data.max_lsi,
            currentLsi: data.current_lsi,
            status: `${data.current_lsi}/${data.max_lsi}`,
            action: (
              <>
                <Tooltip title="Select Schedule">
                  <IconButton
                    onClick={() => {
                      setScheduleId(data.id);
                      openDialog();
                    }}
                  >
                    <Iconify icon="material-symbols:auto-schedule-outline" />
                  </IconButton>
                </Tooltip>
              </>
            ),
          }))
        );
      },
      onError: (error) => {
        toast.error("Something went wrong.");
      },
    }
  );

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4}>
            <Calendar date={date} setDate={setDate} GetSchedule={GetSchedule} />
          </Grid>

          <Grid item xs={12} sm={12} md={8}>
            <AppTable
              tableTitle={"Travel Pass Schedules"}
              buttonTitle={"New Schedule"}
              buttonFunction={() => navigate("/schedules/create")}
              hasButton={false}
              TABLE_HEAD={[
                {
                  id: "scheduleDate",
                  label: "Schedule Date",
                  align: "center",
                },
                {
                  id: "scheduleTime",
                  label: "Schedule Time",
                  align: "center",
                },
                { id: "status", label: "Status", align: "center" },
                { id: "action", label: "Action", align: "center" },
              ]}
              TABLE_DATA={scheduleList}
              isLoading={scheduleIsLoading}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <AppTable
              tableTitle={"My Schedules"}
              buttonTitle={"New Schedule"}
              hasButton={false}
              buttonFunction={() => navigate("/schedules/create")}
              TABLE_HEAD={[
                { id: "scheduleDate", label: "Schedule Date", align: "center" },
                {
                  id: "scheduleTime",
                  label: "Schedule Time",
                  align: "center",
                },
                {
                  id: "referenceCode",
                  label: "Reference Code",
                  align: "center",
                },
                { id: "status", label: "Status", align: "center" },
                // { id: "action", label: "Action", align: "center" },
              ]}
              TABLE_DATA={userSchedules}
              isLoading={scheduleIsLoading}
            />
          </Grid>
        </Grid>
      </Container>

      <DialogModal
        open={open}
        handleClose={() => handleClose()}
        // title={'Delete User'}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
        width="lg"
      >
        <ApplicationForm handleClose={handleClose} scheduleId={scheduleId} />
      </DialogModal>
    </Page>
  );
}
