import * as yup from 'yup';

export const ResetPasswordSchema = yup
  .object({
    newPassword: yup.string().required('Please enter your Password').min(6, 'Password must be atleast 6 characters.'),
    confirmPassword: yup
      .string()
      .required('Please enter your Password')
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
  })
  .required();
