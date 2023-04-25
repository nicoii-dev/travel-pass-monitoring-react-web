/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getVerified: () => apiService.get(`/medical-reservation/verified`),
  getMedicalApplications: () => apiService.get(`/medical-applications`),
  createMedicalApplications: (payload) => apiService.post(`/medical-applications/create`, payload),
  viewMedicalApplications: (id) => apiService.post(`/medical-applications/view/${id}`),
  updateMedicalApplications: (id, payload) => apiService.post(`/medical-applications/update/${id}`, payload),

  getUserMedicalApplications: () =>apiService.post(`medical-applications/user-medical-applications`),

};
