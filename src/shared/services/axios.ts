import axios from 'axios';

import setupInterceptorsTo from '@/shared/services/interceptor';

const axiosInstance = setupInterceptorsTo(
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
    headers: { 'Content-Type': 'application/json' },
  })
);

export default axiosInstance;
