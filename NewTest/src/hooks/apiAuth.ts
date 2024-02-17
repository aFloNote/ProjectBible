import axios, { AxiosRequestConfig } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
export const UseApi = () => {
    const { getAccessTokenSilently } = useAuth0();
  
    const fetchApi = async <T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> => {
      const token = await getAccessTokenSilently();
      
      // Setup default headers if not provided
      if (!config.headers) {
        config.headers = {};
      }
  
      // Append the Authorization header with the Bearer token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('gsd')
      const response = await axios.get<T>('https://localhost/api'+endpoint, config);
      return response.data;
    };

    const uploadApi = async <T, R>(endpoint: string, data: T, config: AxiosRequestConfig = {}): Promise<R> => {
      const token = await getAccessTokenSilently();
      
      // Setup default headers if not provided
      if (!config.headers) {
        config.headers = {};
      }
  
      // Append the Authorization header with the Bearer token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      const response = await axios.post<R>('https://localhost/api' + endpoint, data, {
        ...config,
      
      });
      console.log('response',response);
      return response.data;
    };
  
   
  
    return {fetchApi,uploadApi};
  };