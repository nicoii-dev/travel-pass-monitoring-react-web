import React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";

// material
import { Container, Chip } from "@mui/material";

// components
import Page from "../../../components/Page";
import AppTable from "../../../components/table/AppTable";

// api
import travelPassApplicationApi from "../../../services/travelPassApplicationApi";

// ----------------------------------------------------------------------

export default function TravelPassTable() {
  const { getUserTravelApplications } = travelPassApplicationApi;
  const [applicationList, setApplicationList] = useState([]);

  const {
    data: applicationData,
    status: applicationStatus,
    isFetching: scheduleIsFetching,
  } = useQuery(
    ["get-all-user-travel-applications"],
    () => getUserTravelApplications(),
    {
      retry: 3, // Will retry failed requests 10 times before displaying an error
    }
  );

  useEffect(() => {
    if (applicationStatus === "success") {
      setApplicationList(
        applicationData.data.map((data) => ({
          id: data.id,
          travelType: data.travel_type.toUpperCase(),
          dateOfTravel: data.date_of_travel,
          applicationReferenceCode: data.reference_code,
          appointmentReferenceCode: data.reservation.reference_code,
          status: (
            <Chip
              label={data.status.toString() === "1" ? "Approved" : data.status.toString() === "2" ? "Declined" : "Pending"}
              color={data.status.toString() === "1" ? "success" : data.status.toString() === "2" ? "error" : "warning"}
            />
          ),
        }))
      );
    }
  }, [applicationStatus, applicationData]);

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <AppTable
          tableTitle={"Travel Pass Applications"}
          hasButton={false}
          TABLE_HEAD={[
            { id: "travelType", label: "Travel Type", align: "center" },
            { id: "dateOfTravel", label: "Date of Travel", align: "center" },
            {
              id: "applicationReferenceCode",
              label: "Application Reference Code",
              align: "center",
            },
            {
              id: "appointmentReferenceCode",
              label: "Appointment Reference Code",
              align: "center",
            },
            { id: "status", label: "Status", align: "center" },
          ]}
          TABLE_DATA={applicationList}
        />
      </Container>
    </Page>
  );
}
