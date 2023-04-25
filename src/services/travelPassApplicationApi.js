/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllApplications: () => apiService.get(`/travelpass-applications`),
  getUserQr: (payload) => apiService.post(`/travelpass-applications/user`, payload),
  viewQrDetails: (id) =>apiService.post(`travelpass-applications/view/${id}`),
  getTravelApplications: (payload) =>apiService.post(`travelpass-applications/application`, payload),
  getDetails: (id) =>apiService.post(`travelpass-applications/application/${id}`),
  updateApplication: (id, payload) =>apiService.post(`travelpass-applications/update/${id}`, payload),
  viewApplication: (id) =>apiService.post(`travelpass-applications/view/${id}`),
};
