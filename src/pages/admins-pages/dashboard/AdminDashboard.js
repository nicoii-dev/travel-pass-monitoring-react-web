import { useState, useEffect, useCallback } from "react";
import { useQuery } from "react-query";
// @mui
import { Grid, Container, Typography } from "@mui/material";
// components
import Page from "../../../components/Page";

// sections
import AppOrderTimeline from "./AppOrderTimeline";
import AppWidgetSummary from "./AppWidgetSummary";
import AdminGraph from "./AdminGraph";

import dashboardApi from "../../../services/dashboardApi";

// ----------------------------------------------------------------------

export default function AdminDashboard() {
  const { getDashboard } = dashboardApi;
  const [dashboardList, setDashboardList] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const {
    data: dashboardData,
    status: dashboardStatus,
    isFetching: dashboardIsFetching,
  } = useQuery(["get-dashboard"], () => getDashboard(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (dashboardStatus === "success") {
      let arr = [];
      setDashboardList(dashboardData);
      dashboardData?.data?.applicationByMonth.map((data) => {
        for (let i = 1; i <= 12; i++) {
          if (parseInt(data.month) == i) {
            arr.push({
              total: data.total,
              month: parseInt(data.month),
            });
          } else {
            arr.push({
              total: 0,
              month: i,
            });
          }
        }
      });
      setGraphData(arr);
    }
  }, [dashboardData, dashboardStatus]);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={2.3}>
            <AppWidgetSummary
              title="Number of registered LSI"
              total={dashboardList?.data?.lsi}
              icon={"vaadin:records"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.3}>
            <AppWidgetSummary
              title="Number of Admins"
              total={dashboardList?.data?.admin}
              color="info"
              icon={"ph:users-four-duotone"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.3}>
            <AppWidgetSummary
              title="Approved Applications"
              total={dashboardList?.data?.pending}
              color="warning"
              icon={"carbon:task-approved"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.3}>
            <AppWidgetSummary
              title="Approved Applications"
              total={dashboardList?.data?.approved}
              color="success"
              icon={"carbon:task-approved"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.3}>
            <AppWidgetSummary
              title="Declined Applications"
              total={dashboardList?.data?.declined}
              color="error"
              icon={"fluent-mdl2:event-declined"}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {dashboardList?.data?.applicationByMonth && (
              <AdminGraph
                lineGraphData={graphData}
              />
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="New Users"
              list={dashboardList?.data?.users}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
