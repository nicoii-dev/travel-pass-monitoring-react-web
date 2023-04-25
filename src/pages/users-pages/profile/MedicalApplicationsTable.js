import React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";

// material
import { Container, Chip } from "@mui/material";

// components
import Page from "../../../components/Page";
import AppTable from "../../../components/table/AppTable";

// api
import medicalApplicationApi from "../../../services/medicalApplicationApi";

// ----------------------------------------------------------------------

export default function MedicalTable() {
  const { getUserMedicalApplications } = medicalApplicationApi;
  const [applicationList, setApplicationList] = useState([]);

  const {
    data: applicationData,
    status: applicationStatus,
    isFetching: scheduleIsFetching,
  } = useQuery(
    ["get-all-user-medical-applications"],
    () => getUserMedicalApplications(),
    {
      retry: 3, // Will retry failed requests 10 times before displaying an error
    }
  );

  useEffect(() => {
    if (applicationStatus === "success") {
      setApplicationList(
        applicationData.data.map((data) => ({
          id: data.id,
          remarks: data.comment,
          applicationReferenceCode: data.reference_code,
          appointmentReferenceCode: data.appointment.reference_code,
          status: (
            <Chip
              label={
                data.status.toString() === "1"
                  ? "Approved"
                  : data.status.toString() === "2"
                  ? "Declined"
                  : "Pending"
              }
              color={
                data.status.toString() === "1"
                  ? "success"
                  : data.status.toString() === "2"
                  ? "error"
                  : "warning"
              }
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
          tableTitle={"Medical Applications"}
          hasButton={false}
          TABLE_HEAD={[
            { id: "remarks", label: "Remarks", align: "center" },
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
