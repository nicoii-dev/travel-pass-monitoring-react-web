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
  Button,
  Box,
  TextareaAutosize,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import DialogModal from "../../../../components/DialogModal";
import {
  FormProvider,
  RHFTextField,
  RHFDropDown,
  RHFDatePicker,
  RHFTextArea,
} from "../../../../components/hook-form";

// api
import travelPassApplicationApi from "../../../../services/travelPassApplicationApi";

// schema
import { CreateQrDetailsSchema } from "../../../../yup-schema/createQrDetailsSchema";
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function QrDetails({ travelApplicationData }) {
  const { approveApplication } = travelPassApplicationApi;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [payloadData, setPayloadData] = useState([]);

  const minDate = new Date(new Date().getTime() + 86400000);

  const defaultValues = {
    startDate: dayjs(minDate),
    endDate: dayjs(minDate),
    remarks: "",
  };

  const methods = useForm({
    resolver: yupResolver(CreateQrDetailsSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const { mutate: Approve, isLoading: approveIsLoading } = useMutation(
    (payload) => approveApplication(travelApplicationData?.data?.id, payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-travelpass-applications"]);
        toast.success("Approved successfully");
        navigate(-1);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    setOpen(true);
    const payload = {
      user_id: travelApplicationData.data.user.id.toString(),
      status: "1",
      remarks: data.remarks,
      start_date: data.startDate,
      end_date: data.endDate,
    };
    setPayloadData(payload);
    console.log(payload);
    // await Create(payload);
  };

  return (
    <Container>
      <div style={{ padding: 5, zIndex: 0 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 2, alignSelf: "flex-end" }}
        >
          Input QR Details
        </Typography>
      </div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <RHFDatePicker
              name="startDate"
              label="Start Date"
              type="date"
              sx={{ width: "100%" }}
              disablePast
              minDate={dayjs(minDate)}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <RHFDatePicker
              name="endDate"
              label="Expiry Date"
              type="date"
              sx={{ width: "100%" }}
              disablePast
              minDate={dayjs(minDate)}
            />
          </Stack>
          <RHFTextArea
            name="remarks"
            label="Remarks"
            placeholder="Remarks.."
            style={{
              width: "100%",
              fontSize: 16,
              borderColor: "black",
              outline: "none",
              borderRadius: 5,
              height: 100,
              marginTop: 10,
            }}
          />

          <Stack direction="row" spacing={4}>
            <Box width="100%">
              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                // loading={isCreateLoading}
                type="submit"
              >
                Save
              </LoadingButton>
            </Box>
          </Stack>
        </Stack>
      </FormProvider>

      <DialogModal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        // title={'Delete User'}
        // subtitle={'Are you sure you want to delete this user?'}
        buttons
      >
        <Typography variant="h4" sx={{ mt: 1, textAlign: "center" }}>
          {"Are your sure you want to APPROVE this application?"}
        </Typography>

        <Stack
          spacing={2}
          direction="row"
          sx={{ alignItems: "flex-end", justifyContent: "flex-end", mt: 7 }}
        >
          <Button variant="text" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <LoadingButton
            variant="outlined"
            color={"success"}
            onClick={() => Approve(payloadData)}
            loading={approveIsLoading}
          >
            Yes
          </LoadingButton>
        </Stack>
      </DialogModal>
    </Container>
  );
}
