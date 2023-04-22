import * as yup from 'yup';

export const ScheduleSchema = yup
  .object({
    scheduleDate: yup.string().required('Schedule Date is required'),
    scheduleTime: yup.string().required('Schedule Time is required'),
    maxLsi: yup.string().required('Max LSI is required'),
  })
  .required();
