/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getSchedules: () => apiService.get(`/schedule`),
  getSchedulesByDate: (payload) => apiService.post(`schedule/date`, payload),
  getMedicalSchedulesByDate: (payload) => apiService.post(`schedule/medical`, payload),
  getTravelPassSchedulesByDate: (payload) => apiService.post(`schedule/travelpass`, payload),
  createSchedules: (payload) => apiService.post(`/schedule/create`, payload),
  viewSchedule: (id) => apiService.post(`/schedule/view/${id}`),
  updateSchedule: (id, payload) => apiService.post(`/schedule/update/${id}`, payload),
  deleteSchedule: (id) => apiService.post(`/schedule/delete/${id}`),
};
