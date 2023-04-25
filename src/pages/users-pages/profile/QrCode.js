import React, { useEffect } from "react";
import QRCode from "react-qr-code";
import { useQuery } from "react-query";
import _ from "lodash";
// components
import { getLocalStorageItem } from "../../../utils/getLocalStorage";
import { USER } from "../../../utils/constants/user";

// api
import qrApi from "../../../services/qrApi";
import { Typography } from "@mui/material";

const QrCodePage = ({ qrDetails, setQrDetails }) => {
  const userData = getLocalStorageItem(USER.USER_DATA);
  const { viewQr } = qrApi;
  const {
    data: qrData,
    status: qrStatus,
    isFetching: userIsFetching,
  } = useQuery(
    ["get-user-qr"],
    () => viewQr({ user_id: userData.id.toString() }),
    {
      retry: 3, // Will retry failed requests 10 times before displaying an error
    }
  );

  useEffect(() => {
    if (qrStatus === "success") {
      setQrDetails(qrData);
    }
  }, [qrData, qrStatus, setQrDetails]);

  return (
    <>
      {_.isEmpty(qrDetails.data) ? (
        <Typography style={{ fontSize: 24, fontFamily: "monospace" }}>
          You don't have any ACTIVE QR Code
        </Typography>
      ) : (
        <QRCode
          value={`localhost:3000/scanned-qr/${qrDetails?.data?.id}`}
          size={200}
          style={{
            height: "auto",
            maxWidth: "100%",
            width: "100%",
            marginTop: 50,
          }}
        />
      )}
    </>
  );
};

export default QrCodePage;
