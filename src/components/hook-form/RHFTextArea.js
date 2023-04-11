import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { TextareaAutosize, Typography, Box } from "@mui/material";

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
        <Box width={"100%"}>
          <TextareaAutosize
            {...field}
            style={{
              width: "100%",
              fontSize: 16,
              borderColor: error ? "red" : "black",
              outline: "none",
            }}
            value={field.value}
            error={!!error}
            helperText={error?.message}
            {...other}
          />
          {error ? (
            <Typography sx={{ color: "#FF3333", fontSize: 12, marginLeft: 2 }}>
              {error.message}
            </Typography>
          ) : null}
        </Box>
      )}
    />
  );
}
