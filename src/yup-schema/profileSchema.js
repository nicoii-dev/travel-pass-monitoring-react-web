import * as yup from 'yup';

export const UpdateProfileSchema = yup
  .object({
    firstName: yup.string().required('First name is required').min(2, 'First name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    middleName: yup.string().required('Middle name is required').min(2, 'Middle name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    lastName: yup.string().required('Last name is required').min(2, 'Last name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    gender: yup.string().required('Gender is required'),
    civilStatus: yup.string().required('Civil Status is required'),
    phoneNumber: yup.string().required('Phone number is required').matches(/^[0-9]+$/, 'Numbers only').min(11, 'Phone number must be 11 digits').matches(/^(09|\+639)\d{9}$/gm, 'Invalid phone number'),
    curentAddress: yup.string().required('Current Address is required'),
    permanentAddress: yup.string().required('Location is required'),
  })
  .required();