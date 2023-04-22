/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getLsi: () => apiService.get(`/lsi`),
  viewSchedule: (id) => apiService.post(`/lsi/view/${id}`),
};
