import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
import ReactDatePicker from "react-datepicker";

// ----------------------------------------------------------------------

RHFReactDatePicker.propTypes = {
  name: PropTypes.string,
};

export default function RHFReactDatePicker({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <ReactDatePicker
            selected={value}
            // value={value}
            onChange={onChange}
          />
        )}
      />
    </>
  );
}
