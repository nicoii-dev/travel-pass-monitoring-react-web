import { configureStore } from "@reduxjs/toolkit";
import medicalAppointmentSlice from "./medicalAppointmentSlice";

const store = configureStore({
  reducer: {
    userAppointment: medicalAppointmentSlice
  },
});

export default store;
