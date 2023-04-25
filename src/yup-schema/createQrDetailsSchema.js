import * as yup from "yup";

export const CreateQrDetailsSchema = yup
  .object({
    remarks: yup.string().required("Remarks is required"),
  })
  .required();
