import Axios from "axios";

import { getLocalStorageItem } from "../utils/getLocalStorage";
import { USER } from "../utils/constants/user";

const apiService = Axios.create();

const withToken = (config) => {
  const authToken = getLocalStorageItem(USER.ACCESS_TOKEN);

  return {
    ...config,
    headers: {
      Accept: "application/json",
      ...config.headers,
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  };
};

apiService.interceptors.request.use(withToken);
// eslint-disable-next-line no-undef
apiService.defaults.baseURL = `${process.env.REACT_APP_API_LOCAL_URL}api`;
// eslint-disable-next-line no-undef
export default apiService;
