/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllApplications: () => apiService.get(`/travelpass-applications`),
  getUserQr: (payload) => apiService.post(`/travelpass-applications/user`, payload),
  viewQrDetails: (id) =>apiService.post(`travelpass-applications/view/${id}`),
  getTravelApplications: (payload) =>apiService.post(`travelpass-applications/application`, payload),
  getDetails: (id) =>apiService.post(`travelpass-applications/application/${id}`),
  viewApplication: (id) =>apiService.post(`travelpass-applications/view/${id}`),

  approveApplication: (id, payload) =>apiService.post(`travelpass-applications/approve/${id}`, payload),
  declineApplication: (id, payload) =>apiService.post(`travelpass-applications/decline/${id}`, payload),

  getUserTravelApplications: () =>apiService.post(`travelpass-applications/user-travel-applications`),
};
