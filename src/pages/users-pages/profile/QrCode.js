import React, {useEffect} from "react";
import QRCode from "react-qr-code";
import { useQuery } from "react-query";

// components
import { getLocalStorageItem } from "../../../utils/getLocalStorage";
import { USER } from "../../../utils/constants/user";

// api
import qrApi from "../../../services/qrApi";

const QrCodePage = ({qrDetails, setQrDetails}) => {
  const userData = getLocalStorageItem(USER.USER_DATA)
  const {viewQr} = qrApi;
  const {
    data: qrData,
    status: qrStatus,
    isFetching: userIsFetching,
  } = useQuery(['get-user-qr'], () => viewQr({user_id: userData.id.toString()}), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if(qrStatus === 'success') {
      setQrDetails(qrData)
    }
  }, [qrData, qrStatus, setQrDetails])

  return (
    <>
      <QRCode
        value={`localhost:3000/scanned-qr/${qrDetails?.data?.id}`}
        size={200}
        style={{ height: "auto", maxWidth: "100%", width: "100%", marginTop: 50 }}
      />
    </>
  );
};

export default QrCodePage;
