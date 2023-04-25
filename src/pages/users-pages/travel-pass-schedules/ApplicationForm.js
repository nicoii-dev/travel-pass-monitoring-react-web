import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
// @mui
import { Typography, Box, Stack, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import moment from "moment";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import {
  FormProvider,
  RHFDropDown,
  RHFDatePicker,
} from "../../../components/hook-form";
import PlaceOfOrigin from "./PlaceOfOrigin";
import PlaceOfDestination from "./PlaceOfDestination";
import DialogModal from "../../../components/DialogModal";

// api
import travelPassReservationApi from "../../../services/travelPassReservationApi";

// schema
import { TravelPassApplicationSchema } from "../../../yup-schema/travelpassApplicationSchema";

// ----------------------------------------------------------------------

const travelType = [
  { value: "land", label: "Land" },
  { value: "sea", label: "Sea" },
  { value: "air", label: "Air" },
];

export default function ApplicationForm({ handleClose, scheduleId }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { createReservation } = travelPassReservationApi;
  const [openConfirm, setOpenConfirm] = useState(false);
  const [applicationDetails, setApplicationDetails] = useState([]);

  const minDate = new Date(new Date().getTime() + 86400000);

  const defaultValues = {
    travelType: "land",
    dateOfTravel: "",
    originRegion: "",
    originProvince: "",
    originCity: "",
    originBarangay: "",
    originStreet: "",
    originZipcode: "",
    destinationRegion: "",
    destinationProvince: "",
    destinationCity: "",
    destinationBarangay: "",
    destinationStreet: "",
    destinationZipcode: "",
  };

  const methods = useForm({
    resolver: yupResolver(TravelPassApplicationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const { mutate: Create, isLoading: isCreateLoading } = useMutation(
    (payload) => createReservation(payload),
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
    setOpenConfirm(true);
    const payload = {
      schedule_id: scheduleId.toString(),
      travel_type: data.travelType,
      date_of_travel: moment(data.dateOfTravel).format("YYYY-MM-DD"),

      origin_region: data.originRegion,
      origin_province: data.originProvince,
      origin_city: data.originCity,
      origin_barangay: data.originBarangay,
      origin_street: data.originStreet,
      origin_zipcode: data.originZipcode,

      destination_region: data.destinationRegion,
      destination_province: data.destinationProvince,
      destination_city: data.destinationCity,
      destination_barangay: data.destinationBarangay,
      destination_street: data.destinationStreet,
      destination_zipcode: data.destinationZipcode,
    };
    setApplicationDetails(payload);
  };

  const confirmHandler = () => {
    Create(applicationDetails);
  };

  useEffect(() => {
    if (scheduleId === undefined || scheduleId === null) {
      handleClose();
    }
  }, [scheduleId]);
  console.log(scheduleId)

  return (
    <>
      <div style={{ padding: 5, zIndex: 0 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 2, alignSelf: "flex-end" }}
        >
          Application Form
        </Typography>
      </div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <RHFDropDown
              name="travelType"
              label="Travel Type"
              dropDownData={travelType}
            />
            <RHFDatePicker
              name="dateOfTravel"
              label="Date of Travel"
              type="date"
              sx={{ width: "100%" }}
              disablePast
              minDate={dayjs(minDate)}
            />
          </Stack>

          <Typography sx={{ fontWeight: "bold" }}>Place of Origin</Typography>
          <PlaceOfOrigin />

          <Typography sx={{ fontWeight: "bold" }}>
            Place of Destination
          </Typography>
          <PlaceOfDestination />

          <Box
            width="25%"
            sx={{ placeSelf: "flex-end", display: "flex", gap: 2 }}
          >
            <LoadingButton
              fullWidth
              size="large"
              loading={isCreateLoading}
              type="button"
              onClick={() => handleClose()}
            >
              Close
            </LoadingButton>
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
      </FormProvider>
      <DialogModal
        open={openConfirm}
        handleClose={() => {
          setOpenConfirm(false);
        }}
        // title={'Delete User'}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
      >
        <Typography variant="h4" sx={{ mt: 1, textAlign: "center" }}>
          Are you sure you want apply with details?
        </Typography>
        <Stack
          spacing={2}
          direction="row"
          sx={{ alignItems: "flex-end", justifyContent: "flex-end", mt: 7 }}
        >
          <Button variant="text" onClick={() => setOpenConfirm(false)}>
            Cancel
          </Button>

          <LoadingButton
            variant="outlined"
            color="success"
            onClick={() => confirmHandler()}
            loading={isCreateLoading}
          >
            Yes
          </LoadingButton>
        </Stack>
      </DialogModal>
    </>
  );
}
