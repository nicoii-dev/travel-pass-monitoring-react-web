import * as yup from 'yup';

export const CreateUserSchema = yup
  .object({
    firstName: yup.string().required('First name is required').min(2, 'First name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    middleName: yup.string().required('Middle name is required').min(2, 'Middle name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    lastName: yup.string().required('Last name is required').min(2, 'Last name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    gender: yup.string().required('Gender is required'),
    phoneNumber: yup.string().required('Phone number is required').matches(/^[0-9]+$/, 'Numbers only').min(11, 'Phone number must be 11 digits').matches(/^(09|\+639)\d{9}$/gm, 'Invalid phone number'),
    dob: yup.string().required('Date of birth is required'),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Please enter your Email'),
    role: yup.string().required('Role is required'),
    region: yup.string().required('Region is required'),
    province: yup.string().required('Province is required'),
    city: yup.string().required('City is required'),
    barangay: yup.string().required('Barangay is required'),
    street: yup.string().required('Street is required'),
    zipcode: yup.string().required('Zip Code is required')
  })
  .required();
