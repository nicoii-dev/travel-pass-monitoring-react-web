import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextField({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            // inputFormat="MM/DD/YYYY"
            label={other.label || "Date of Birth"}
            // maxDate={new Date()}
            value={field.value}
            onChange={field.onChange}
            onError={error}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      )}
    />
  );
}
