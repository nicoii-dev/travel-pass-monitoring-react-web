import * as yup from 'yup';

export const SignupSchema = yup
  .object({
    firstName: yup.string().required('First name is required').min(2, 'First name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    middleName: yup.string().required('Middle name is required').min(2, 'Middle name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    lastName: yup.string().required('Last name is required').min(2, 'Last name must be atleast 2 letters').matches(/^[A-Za-z\s]*$/, 'Letters only'),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Please enter your Email'),
    password: yup.string().required('Please enter your Password').min(6),
    confirmPassword: yup
      .string()
      .required('Please enter your Password')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  })
  .required();
