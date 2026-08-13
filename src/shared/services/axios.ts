import axios from 'axios';

import { apiBaseUrl } from '@/shared/constants/api';
import setupInterceptorsTo from '@/shared/services/interceptor';

const axiosInstance = setupInterceptorsTo(
  axios.create({
    baseURL: apiBaseUrl,
    headers: { 'Content-Type': 'application/json' },
  })
);

export default axiosInstance;
