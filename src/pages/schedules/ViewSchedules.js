import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
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

export default function ViewSchedule() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const schedule = useParams();
  const { viewSchedule, updateSchedule } = schedulesApi;
  const minDate = new Date(new Date().getTime() + 86400000);

  const defaultValues = {
    scheduleDate: new Date(),
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
    reset,
  } = methods;

  const { mutate: View, isLoading: viewIsLoading } = useMutation(
    () => viewSchedule(schedule.id),
    {
      onSuccess: (data) => {
        const { schedule_date, schedule_time, max_lsi } = data?.data;

        reset({
          scheduleDate: moment(schedule_date).format("MM-DD-YYYY"),
          scheduleTime: schedule_time,
          maxLsi: max_lsi,
        });
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  useEffect(() => {
    View();
  }, [View, schedule]);

  const { mutate: Update, isLoading: isCreateLoading } = useMutation(
    (payload) => updateSchedule(schedule.id, payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-schedules"]);
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
      schedule_date: moment(data.scheduleDate).format("YYYY-MM-DD"),
      schedule_time: data.scheduleTime,
      max_lsi: data.maxLsi,
    };
    await Update(payload);
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
                Viewing Schedule
              </Typography>
            </div>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <RHFDropDown
                      name="scheduleType"
                      label="Schedule Type"
                      dropDownData={scheduleType}
                    />
                  </Stack>

                  <RHFDatePicker
                    name="scheduleDate"
                    label="Schedule Date"
                    type="date"
                    sx={{ width: "100%" }}
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
                      Update
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
