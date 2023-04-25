/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getQr: () => apiService.get(`/qrcode`),
  viewQr: (payload) => apiService.post(`/qrcode/view/`, payload),
};
