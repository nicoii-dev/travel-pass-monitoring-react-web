import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import moment from "moment";
// @mui
import { styled } from "@mui/material/styles";
import {
  Container,
  Typography,
  Tooltip,
  IconButton,
  Stack,
  InputAdornment,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import {
  FormProvider,
  RHFTextField,
  RHFDropDown,
  RHFDatePicker,
} from "../../components/hook-form";

// api
import schedulesApi from "../../services/schedulesApi";

// schema
import { ScheduleSchema } from "../../yup-schema/createScheduleSchema";
// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
    marginTop: -50,
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: "65%",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(5, 5),
  marginTop: 50,
  borderRadius: 10,
  backgroundColor: "#F0ECCF",
}));

// ----------------------------------------------------------------------

const timeData = [
  { value: "1", label: "8AM to 10AM" },
  { value: "2", label: "10AM to 12PM" },
  { value: "3", label: "1PM to 3PM" },
  { value: "4", label: "3PM to 5PM" },
];

const scheduleType = [
  { value: "travelpass", label: "Travel Pass" },
  { value: "medical", label: "Medical Appointment" },
];

export default function CreateSchedule() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { createSchedules } = schedulesApi;

  const minDate = new Date(new Date().getTime() + 86400000);
  
  const defaultValues = {
    scheduleType: 'medical',
    scheduleDate: dayjs(minDate),
    scheduleTime: "1",
    maxLsi: 1,
  };

  const methods = useForm({
    resolver: yupResolver(ScheduleSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const { mutate: Create, isLoading: isCreateLoading } = useMutation(
    (payload) => createSchedules(payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-users"]);
        toast.success("Created successfully");
        navigate(-1);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    const payload = {
      schedule_type: data.scheduleType,
      schedule_date: moment(data.scheduleDate).format('YYYY-MM-DD'),
      schedule_time: data.scheduleTime,
      max_lsi: data.maxLsi,
    };
    await Create(payload);
  };

  return (
    <Page title="Register">
      <RootStyle>
        <Container>
          <ContentStyle>
            <div style={{ padding: 5, zIndex: 0 }}>
              <IconButton onClick={() => navigate(-1)}>
                <Iconify
                  icon="ion:arrow-back-circle"
                  sx={{ width: 30, height: 30 }}
                />
              </IconButton>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ mb: 2, alignSelf: "flex-end" }}
              >
                Creating Schedule
              </Typography>
            </div>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFDropDown
                    name="scheduleType"
                    label="Schedule Type"
                    dropDownData={scheduleType}             
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFDatePicker
                    name="scheduleDate"
                    label="Schedule Date"
                    type="date"
                    sx={{ width: "100%" }}
                    disablePast
                    minDate={dayjs(minDate)}                  
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFDropDown
                    name="scheduleTime"
                    label="Schedule Time"
                    dropDownData={timeData}
                  />
                </Stack>

                <RHFTextField name="maxLsi" label="Max LSI" type="number" />

                <Stack direction="row" spacing={4}>
                  <Box width="100%">
                    <LoadingButton
                      fullWidth
                      size="large"
                      variant="contained"
                      loading={isCreateLoading}
                      type="submit"
                    >
                      Create
                    </LoadingButton>
                  </Box>
                </Stack>
              </Stack>
            </FormProvider>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
