import { filter, map } from "lodash";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// material
import {
  Container,
  Chip,
  Tooltip,
  IconButton,
  Stack,
  Button,
  Typography,
} from "@mui/material";

// components
import Page from "../../../components/Page";
import Iconify from "../../../components/Iconify";
import AppTable from "../../../components/table/AppTable";

// api
import lsiApi from "../../../services/lsiApi";

// ----------------------------------------------------------------------

export default function Lsi() {
  const { getLsi } = lsiApi;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [lsiList, setLsiList] = useState([]);
  const [open, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    data: lsiData,
    status: lsiStatus,
    isFetching: lsiIsFetching,
  } = useQuery(["get-all-lsi"], () => getLsi(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (lsiStatus === "success") {
      setLsiList(
        lsiData?.data?.map((data) => ({
          id: data.id,
          firstName: data.first_name,
          middleName: data.last_name,
          lastName: data.last_name,
          dob: data.dob,
          gender: data.gender,
          phoneNumber: data.phone_number,
          email: data.email,
          role: (
            <span>
              {data.role.toUpperCase()}
            </span>
          ),
          status: (
            <Chip
              // onClick={() => {
              //   setOpen(true);
              //   setUserId(data.id);
              //   if (data.status) {
              //     setUserStatus(true);
              //   } else {
              //     setUserStatus(false);
              //   }
              //   // if (data.status) deactivateUsers(data.id);
              //   // if (!data.status) activateUsers(data.id);
              // }}
              label={data.status.toString() === '1' ? 'Active' : 'Deactived'}
              color={data.status.toString() === '1' ? 'success' : 'error'}
            />
          ),
          action: (
            <>
              <Tooltip title="View">
                <IconButton onClick={() => setLsiHandler(data)}>
                  <Iconify icon="ic:baseline-remove-red-eye" />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Delete" onClick={() => {
                dispatch(setUser(data));
                openDialog()
              }}>
                <IconButton>
                  <Iconify icon="bxs:trash" />
                </IconButton>
              </Tooltip> */}
            </>
          ),
        }))
      );
    }
  }, [lsiStatus, lsiData]);

  const setLsiHandler = async (data) => {
    console.log(data)
    navigate(`/locally-stranded-individual/view/${data.id}`);
  };

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <AppTable
          tableTitle={"Schedules Page"}
          buttonTitle={"New Schedule"}
          buttonFunction={() => navigate("/schedules/create")}
          TABLE_HEAD={[
            { id: 'firstName', label: 'First name', align: false },
            { id: 'middleName', label: 'Middle name', align: false },
            { id: 'lastName', label: 'Last name', align: false },
            { id: 'dob', label: 'Date of Birth', align: false },
            // { id: 'gender', label: 'Gender', align: false },
            { id: 'phoneNumber', label: 'Phone number', align: false },
            { id: 'email', label: 'Email', align: false },
            { id: 'role', label: 'Role', align: 'center' },
            { id: 'status', label: 'Status', align: 'center' },
            { id: 'action', label: 'Action', align: 'center' },
          ]}
          TABLE_DATA={lsiList}
        />
      </Container>
    </Page>
  );
}
