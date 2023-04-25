/* eslint-disable camelcase */
import { useState } from "react";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
// @mui
import { Stack, IconButton, InputAdornment, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// schema
import { UpdateUserPasswordSchema } from "../../../yup-schema/updatePasswordSchema";

// api
import userApi from "../../../services/userApi";

// components
import Iconify from "../../../components/Iconify";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { getLocalStorageItem } from "../../../utils/getLocalStorage";
import { USER } from "../../../utils/constants/user";

// ----------------------------------------------------------------------

export default function SecurityForm() {
  const { updatePassword } = userApi;
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const userData = getLocalStorageItem(USER.USER_DATA);

  const defaultValues = {
    scheduleDate: new Date(),
    scheduleTime: "1",
    maxLsi: 1,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    reset,
  } = methods;

  const { mutate: Update, isLoading: updateIsLoading } = useMutation(
    (payload) => updatePassword(payload),
    {
      onSuccess: (data) => {
        // queryClient.invalidateQueries(["get-all-users"]);
        toast.success("Password updated successfully");
        reset({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    const payload = {
      email: userData.email,
      current_password: data.currentPassword,
      new_password: data.newPassword,
    };
    await Update(payload);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{marginTop: 5}}>
        <RHFTextField
          name="currentPassword"
          label="Current password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="newPassword"
          label="New password"
          type={newPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setNewPassword(!newPassword)}
                >
                  <Iconify
                    icon={newPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmPassword"
          label="Confirm password"
          type={showConfirmPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Iconify
                    icon={
                      showConfirmPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box width="100%">
          <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            loading={updateIsLoading}
            type="submit"
          >
            Update
          </LoadingButton>
        </Box>
        </Stack>
      </FormProvider>
    </>
  );
}
