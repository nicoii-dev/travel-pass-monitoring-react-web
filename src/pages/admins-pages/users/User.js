import { filter, map } from 'lodash';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// material
import { Container, Chip, Tooltip, IconButton, Stack, Button, Typography } from '@mui/material';

// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import AppTable from '../../../components/table/AppTable';

// api
import userApi from '../../../services/userApi';

// ----------------------------------------------------------------------

export default function User() {
  const { getUser, deleteUser } = userApi;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [userList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    data: userData,
    status: userStatus,
    isFetching: userIsFetching,
  } = useQuery(['get-all-users'], () => getUser(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (userStatus === 'success') {
      setUserList(
        userData?.data?.map((data) => ({
          id: data.id,
          firstName: data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1),
          middleName: data.last_name.charAt(0).toUpperCase() + data.middle_name.slice(1),
          lastName: data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1),
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
                <IconButton onClick={() => setUserHandler(data)}>
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

  }, [userStatus, userIsFetching]);

  const setUserHandler = async (data) => {
    console.log(data)
    navigate(`/user/view/${data.id}`);
  };

  const { mutate: Delete, isLoading: isLoad } = useMutation((payload) => deleteUser(payload), {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['get-users']);
      toast.success('Deleted successfully.');
      handleClose();
    },
    onError: (data) => {
      toast.error('Failed to delete.');
    },
  });

  const deleteUserHandler = async (id) => {
    await dispatch(Delete(id));
  };

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <AppTable
          tableTitle={'Users Page'}
          buttonTitle={'New User'}
          buttonFunction={() => navigate('/user/create')}
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
          TABLE_DATA={userList}
        />
      </Container>
    </Page>
  );
}
