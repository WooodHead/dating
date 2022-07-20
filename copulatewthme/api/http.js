import axios from 'axios'
import Cookies from "js-cookie";
import { auth } from "store/auth/auth";

const baseURL = process.env.BASE_URL + '/api',
  baseTimeout = 30000;

const instance = axios.create({
  baseURL,
  baseTimeout,
});

instance.interceptors.request.use(config => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (err) => {
    // eslint-disable-next-line global-require
    const store = require('store/index');
    if (err?.response?.status === 401) {
      store.default.dispatch(auth.thunks.logoutImmediately());
    }
    throw err;
  }
);

export default instance;
