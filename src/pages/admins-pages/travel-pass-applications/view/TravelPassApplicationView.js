import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Breadcrumbs,
  Chip,
  Link,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Stack,
  Button,
  TextareaAutosize,
} from "@mui/material";
import { useMutation } from "react-query";
import styled from "@emotion/styled";
import { LoadingButton } from "@mui/lab";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

// components
import Page from "../../../../components/Page";
import TravelPassApplicationForm from "./ApplicationForm";
import TravelPassUser from "./TravelPassUser";
import Iconify from "../../../../components/Iconify";
import DialogModal from "../../../../components/DialogModal";

// api
import travelPassApplicationApi from "../../../../services/travelPassApplicationApi";
import QrDetails from "./QrDetails";

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
    marginTop: -50,
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: "100%",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(5, 5),
  marginTop: 50,
  borderRadius: 10,
  backgroundColor: "#F0ECCF",
}));

const TravelPassApplicationView = () => {
  const navigate = useNavigate();
  const [crumb, setCrumb] = useState("travel");
  const { viewApplication, declineApplication } = travelPassApplicationApi;
  const [applicationDetails, setApplicationDetails] = useState([]);
  const applicationId = useParams();
  const [open, setOpen] = useState(false);
  const [approved, setApproved] = useState(false);
  const [textAreaValue, setTextAreaValue] = React.useState("");

  const {
    data: travelApplicationData,
    status: travelApplicationStatus,
    isFetching: userIsFetching,
  } = useQuery(
    ["get-view-application"],
    () => viewApplication(applicationId.id.toString()),
    {
      retry: 3, // Will retry failed requests 10 times before displaying an error
    }
  );

  useEffect(() => {
    if (travelApplicationStatus === "success") {
      setApplicationDetails(travelApplicationData);
    }
  }, [travelApplicationData, travelApplicationStatus]);

  const { mutate: Update, isLoading: updateIsLoading } = useMutation(
    (payload) => declineApplication(travelApplicationData?.data?.id, payload),
    {
      onSuccess: (data) => {
        // queryClient.invalidateQueries(["get-all-users"]);
        toast.success(data?.data?.message);
        navigate("/travel-pass-applications");
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  const declineApplicationHandler = async () => {
    const payload = {
      status: "2",
      remarks: textAreaValue,
    };
    await Update(payload);
  };

  return (
    <Page title="Profile Page">
      <RootStyle>
        <Container>
          <ContentStyle>
            <div role="presentation" style={{ position: "relative" }}>
              <div style={{ padding: 5, zIndex: 9999, marginBottom: 20 }}>
                <Tooltip title="Back">
                  <IconButton onClick={() => navigate(-1)}>
                    <Iconify
                      icon="ion:arrow-back-circle"
                      sx={{ width: 30, height: 30 }}
                    />
                  </IconButton>
                </Tooltip>
              </div>
              <Breadcrumbs aria-label="breadcrumb">
                <Typography
                  underline="hover"
                  color="inherit"
                  onClick={() => {
                    setCrumb("travel");
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  Travel Pass Application
                </Typography>
                <Typography
                  underline="hover"
                  color="inherit"
                  onClick={() => {
                    setCrumb("user");
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  User Details
                </Typography>
              </Breadcrumbs>

              <div style={{ position: "absolute", top: 10, right: 10 }}>
                {travelApplicationData?.data?.status === "0" ? (
                  <>
                    <LoadingButton
                      variant="contained"
                      color="error"
                      onClick={() => {
                        setOpen(true);
                        setApproved(false);
                      }}
                      sx={{ marginRight: 2, width: 120 }}
                      type="button"
                    >
                      Decline
                    </LoadingButton>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setOpen(true);
                        setApproved(true);
                      }}
                      sx={{ width: 120 }}
                      type="button"
                    >
                      Approve
                    </LoadingButton>
                  </>
                ) : travelApplicationData?.data?.status === "1" ? (
                  <Typography sx={{ color: "green", fontWeight: "bold" }}>
                    Approved Application
                  </Typography>
                ) : (
                  <Typography sx={{ color: "red", fontWeight: "bold" }}>
                    Declined Application
                  </Typography>
                )}
              </div>
            </div>

            <Box sx={{ marginTop: 5 }}>
              {crumb === "travel" ? (
                <TravelPassApplicationForm
                  applicationDetails={applicationDetails.data}
                />
              ) : (
                <TravelPassUser applicationDetails={applicationDetails.data} />
              )}
            </Box>
          </ContentStyle>
        </Container>
      </RootStyle>
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
          {approved
            ? null
            : "Are your sure you want to DECLINE this application?"}
        </Typography>
        {approved ? (
          <QrDetails travelApplicationData={travelApplicationData} />
        ) : (
          <TextareaAutosize
            style={{
              width: "100%",
              fontSize: 16,
              borderColor: "black",
              outline: "none",
              borderRadius: 5,
              height: 100,
              marginTop: 10,
            }}
            placeholder="Remarks"
            value={textAreaValue}
            onChange={(e) => {
              setTextAreaValue(e.target.value);
            }}
          />
        )}
        <Stack
          spacing={2}
          direction="row"
          sx={{ alignItems: "flex-end", justifyContent: "flex-end", mt: 7 }}
        >
          <Button variant="text" onClick={() => setOpen(false)}>
            {approved ? "Close" : "Cancel"}
          </Button>
          {approved ? null : (
            <LoadingButton
              variant="outlined"
              color={approved ? "success" : "error"}
              onClick={() => declineApplicationHandler()}
              loading={updateIsLoading}
            >
              Yes
            </LoadingButton>
          )}
        </Stack>
      </DialogModal>
    </Page>
  );
};

export default TravelPassApplicationView;
