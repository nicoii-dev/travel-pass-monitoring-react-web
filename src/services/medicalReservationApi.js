/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAppointments: () => apiService.get(`/medical-reservation`),
  createReservation: (payload) =>
    apiService.post(`/medical-reservation/create`, payload),
  viewSchedule: (id) => apiService.post(`/lsi/view/${id}`),
  getUserSchedules: () =>
    apiService.post(`medical-reservation/view/user-sched`),
};
