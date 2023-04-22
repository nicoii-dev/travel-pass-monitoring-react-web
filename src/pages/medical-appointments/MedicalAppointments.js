import { filter, map } from "lodash";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

// material
import { Container, Tooltip, IconButton, Grid, Chip } from "@mui/material";

// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import AppTable from "../../components/table/AppTable";
import Calendar from "../../components/Calendar";

// api
import medicalReservationApi from "../../services/medicalReservationApi";

// ----------------------------------------------------------------------

export default function MedicalAppointments() {
  const { getAppointments } = medicalReservationApi;
  const navigate = useNavigate();
  const [appointmentList, setAppointmentList] = useState([]);

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
    data: appointmentsData,
    status: appointmentsStatus,
    isFetching: scheduleIsFetching,
  } = useQuery(["get-all-appointments"], () => getAppointments(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (appointmentsStatus === "success") {
      setAppointmentList(
        appointmentsData.data.map((data) => ({
          id: data.id,
          scheduleDate: data.schedule.schedule_date,
          scheduleTime: getTime(data.schedule.schedule_time),
          referenceCode: data.reference_code,
          fullName: `${
            data.user.first_name.charAt(0).toUpperCase() +
            data.user.first_name.slice(1)
          } ${data.user.first_name.charAt(0).toUpperCase()}. ${
            data.user.last_name.charAt(0).toUpperCase() +
            data.user.last_name.slice(1)
          }`,
          status: (
            <Chip
              // onClick={() => {
              //   setOpen(true);
              //   setUserId(data.id);
              //   if (data.status) {
              //     setUserStatus(true);
              //   } else {
              //     setUserStatus(false);
              //   }
              //   // if (data.status) deactivateUsers(data.id);
              //   // if (!data.status) activateUsers(data.id);
              // }}
              label={data.status.toString() === "1" ? "Active" : "Expired"}
              color={data.status.toString() === "1" ? "success" : "error"}
            />
          ),
          action: (
            <>
              <Tooltip title="View Profile">
                <IconButton onClick={() => setUserHandler(data)}>
                  <Iconify icon="ic:baseline-remove-red-eye" />
                </IconButton>
              </Tooltip>
              <>
                <Tooltip title="Set to Appointed">
                  <IconButton onClick={() => setUserHandler(data)} disabled={data.status !== "1"}>
                    <Iconify icon="ic:twotone-file-open" />
                  </IconButton>
                </Tooltip>
              </>
            </>
          ),
        }))
      );
    }
  }, [appointmentsStatus, appointmentsData]);
  
  const setUserHandler = async (data) => {
    navigate(`/medical-appointments/user/view/${data.user.id}`);
  };

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <AppTable
          tableTitle={"Medical Appointments"}
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
            { id: "referenceCode", label: "Reference Code", align: "center" },
            { id: "fullName", label: "Full Name", align: "center" },
            { id: "status", label: "Status", align: "center" },
            { id: "action", label: "Action", align: "center" },
          ]}
          TABLE_DATA={appointmentList}
          // isLoading={scheduleIsLoading}
        />
      </Container>
    </Page>
  );
}
