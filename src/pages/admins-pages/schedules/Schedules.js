import { filter, map } from "lodash";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// material
import {
  Container,
  Chip,
  Tooltip,
  IconButton,
  Stack,
  Button,
  Typography,
} from "@mui/material";

// components
import Page from "../../../components/Page";
import Iconify from "../../../components/Iconify";
import AppTable from "../../../components/table/AppTable";

// api
import schedulesApi from "../../../services/schedulesApi";
import { getLocalStorageItem } from "../../../utils/getLocalStorage";
import { USER } from "../../../utils/constants/user";

// ----------------------------------------------------------------------

export default function Schedules() {
  const { getSchedules, deleteSchedule } = schedulesApi;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [scheduleList, setScheduleList] = useState([]);
  const [open, setOpen] = useState(false);
  const userData = getLocalStorageItem(USER.USER_DATA);

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    data: scheduleData,
    status: scheduleStatus,
    isFetching: scheduleIsFetching,
  } = useQuery(["get-all-schedules"], () => getSchedules(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

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

  useEffect(() => {
    if (scheduleStatus === "success") {
      setScheduleList(
        scheduleData.data.map((data) => ({
          id: data.id,
          scheduleType: data.schedule_type.toUpperCase(),
          scheduleDate: data.schedule_date,
          scheduleTime: getTime(data.schedule_time),
          maxLsi: data.max_lsi,
          currentLsi: data.current_lsi,
          action: (
            <>
              <Tooltip title="View">
                <IconButton
                  onClick={() => {
                    setScheduleHandler(data);
                  }}
                  disabled={
                    (userData.role.toLowerCase() === "police" &&
                      data.schedule_type === "medical") ||
                    (userData.role.toLowerCase() === "medicalstaff" &&
                      data.schedule_type === "travelpass")
                  }
                >
                  <Iconify icon="ic:baseline-remove-red-eye" />
                </IconButton>
              </Tooltip>
              {/* <Tooltip
                title="Delete"
                onClick={() => {
                  openDialog();
                }}
              >
                <IconButton>
                  <Iconify icon="bxs:trash" />
                </IconButton>
              </Tooltip> */}
            </>
          ),
        }))
      );
    }
  }, [scheduleStatus, scheduleData]);

  const setScheduleHandler = async (data) => {
    navigate(`/schedules/view/${data.id}`);
  };

  const { mutate: Delete, isLoading: isLoad } = useMutation(
    (payload) => deleteSchedule(payload),
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(["get-users"]);
        toast.success("Deleted successfully.");
        handleClose();
      },
      onError: (data) => {
        toast.error("Failed to delete.");
      },
    }
  );

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <AppTable
          tableTitle={"Schedules Page"}
          buttonTitle={"New Schedule"}
          buttonFunction={() => navigate("/schedules/create")}
          TABLE_HEAD={[
            { id: "scheduleType", label: "Schedule Type", align: "center" },
            { id: "scheduleDate", label: "Schedule Date", align: "center" },
            { id: "scheduleTime", label: "Schedule Time", align: "center" },
            { id: "maxLsi", label: "Max LSI", align: "center" },
            { id: "currentLsi", label: "Current LSI", align: "center" },
            { id: "action", label: "Action", align: "center" },
          ]}
          TABLE_DATA={scheduleList}
        />
      </Container>
    </Page>
  );
}
