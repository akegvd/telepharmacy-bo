import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

/** Normalized shape every failed request rejects with, regardless of cause (network, HTTP status). */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

//#region Response Interceptor
const onResponse = (response: AxiosResponse): AxiosResponse => response;

const onResponseError = (error: AxiosError): Promise<never> => {
  if (error.code === 'ERR_CANCELED') {
    return Promise.reject(new Error('Request canceled'));
  }

  if (!error.response) {
    const baseURL = error.config?.baseURL;
    return Promise.reject(
      new ApiError(`Could not reach the API${baseURL ? ` at ${baseURL}` : ''}. Is json-server running?`)
    );
  }

  return Promise.reject(
    new ApiError(`Request to ${error.config?.url} failed (${error.response.status})`, error.response.status)
  );
};
//#endregion Response Interceptor

const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.response.use(onResponse, onResponseError);

  return axiosInstance;
};

export default setupInterceptorsTo;
