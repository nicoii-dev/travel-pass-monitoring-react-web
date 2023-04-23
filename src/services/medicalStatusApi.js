/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getVerified: () => apiService.get(`/medical-reservation/verified`),
  getMedicalApplications: () => apiService.get(`/medical-applications`),
  createMedicalApplications: (payload) => apiService.post(`/medical-applications/create`, payload),
  updateMedicalApplications: () =>apiService.post(`medical-applications/view/user-sched`),
};
