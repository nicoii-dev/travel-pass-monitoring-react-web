/* eslint-disable import/no-anonymous-default-export */
import apiService from './axios';

export default {
  forgotPassword: (payload) => apiService.post(`/auth/forgot-password`, payload),
  resetPassword: (payload) => apiService.post(`/auth/reset-password`, payload),
};
