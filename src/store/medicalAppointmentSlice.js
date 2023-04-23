import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userAppointment: []
};

const MedicalAppointmentSlice = createSlice({
  name: 'userAppointment',
  initialState,
  reducers: {
    setAppointment: (state, action) => ({
      ...state,
      userAppointment: action.payload,
    }),
  },
});
export const { setAppointment } = MedicalAppointmentSlice.actions;
export default MedicalAppointmentSlice.reducer;