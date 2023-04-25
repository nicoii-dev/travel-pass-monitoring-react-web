import React, { useEffect, useState, useCallback } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
// @mui
import { Typography, Box, Stack, Button, Container } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import styled from "@emotion/styled";

// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import {
  FormProvider,
  RHFDropDown,
  RHFDatePicker,
} from "../../../../components/hook-form";
import PlaceOfOrigin from "./PlaceOfOrigin";
import PlaceOfDestination from "./PlaceOfDestination";
import DialogModal from "../../../../components/DialogModal";
import Page from "../../../../components/Page";

// api
import travelPassReservationApi from "../../../../services/travelPassReservationApi";

// schema
import { TravelPassApplicationSchema } from "../../../../yup-schema/travelpassApplicationSchema";

// ----------------------------------------------------------------------

const travelType = [
  { value: "land", label: "Land" },
  { value: "sea", label: "Sea" },
  { value: "air", label: "Air" },
];

export default function TravelPassApplicationForm({ applicationDetails }) {
  const minDate = new Date(new Date().getTime() + 86400000);

  const defaultValues = {
    travelType: "land",
    dateOfTravel: new Date(),
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
    reset,
  } = methods;

  const userDetailsHandler = useCallback(() => {
    reset({
      travelType: applicationDetails?.travel_type,
      dateOfTravel: applicationDetails?.date_of_travel,
      originRegion: applicationDetails?.origin_region,
      originProvince: applicationDetails?.origin_province,
      originCity: applicationDetails?.origin_city,
      originBarangay: applicationDetails?.origin_barangay,
      originStreet: applicationDetails?.origin_street,
      originZipcode: applicationDetails?.origin_zipcode,
      destinationRegion: applicationDetails?.destination_region,
      destinationProvince: applicationDetails?.destination_province,
      destinationCity: applicationDetails?.destination_city,
      destinationBarangay: applicationDetails?.destination_barangay,
      destinationStreet: applicationDetails?.destination_street,
      destinationZipcode: applicationDetails?.destination_zipcode,
    });
  }, [applicationDetails, reset]);

  useEffect(() => {
    userDetailsHandler();
  }, [userDetailsHandler]);

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
      <FormProvider methods={methods} onSubmit={() => {}}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <RHFDropDown
              name="travelType"
              label="Travel Type"
              dropDownData={travelType}
              disabled
            />
            <RHFDatePicker
              name="dateOfTravel"
              label="Date of Travel"
              type="date"
              sx={{ width: "100%" }}
              // disablePast
              // minDate={dayjs(minDate)}
              disabled
            />
          </Stack>

          <Typography sx={{ fontWeight: "bold" }}>Place of Origin</Typography>
          <PlaceOfOrigin setValue={setValue} originAddress={applicationDetails} />

          <Typography sx={{ fontWeight: "bold" }}>
            Place of Destination
          </Typography>
          <PlaceOfDestination setValue={setValue} destinationAddress={applicationDetails} />
        </Stack>
      </FormProvider>
    </>
  );
}
