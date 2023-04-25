/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAppointments: () => apiService.get(`/travelpass-reservation`),
  createReservation: (payload) => apiService.post(`/travelpass-reservation/create`, payload),
  viewSchedule: (id) => apiService.post(`/lsi/view/${id}`),
  getUserSchedules: () =>apiService.post(`travelpass-reservation/view/user-sched`),
  setToVerified: (id) =>apiService.post(`travelpass-reservation/verify/${id}`),
};
