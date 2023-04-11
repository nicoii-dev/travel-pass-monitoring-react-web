import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { TextField } from "@mui/material";

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
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <TextField
          {...other}
          fullWidth
          select
          SelectProps={{ native: true }}
          variant="outlined"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          onBlur={onBlur}
          error={!!error}
          helperText={error?.message}
          disabled={other.disabled}
        >
          {other.dropDownData?.map((option, key) => (
            <option key={key} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      )}
    />
  );
}
