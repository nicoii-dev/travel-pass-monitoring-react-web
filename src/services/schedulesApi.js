/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getSchedules: () => apiService.get(`/schedule`),
  createSchedules: (payload) => apiService.post(`/schedule/create`, payload),
  viewSchedule: (id) => apiService.post(`/schedule/view/${id}`),
  updateSchedule: (id, payload) => apiService.post(`/schedule/update/${id}`, payload),
  deleteSchedule: (id) => apiService.post(`/schedule/delete/${id}`),
};
