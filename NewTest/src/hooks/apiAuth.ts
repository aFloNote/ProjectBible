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
  
      const response = await axios.get<T>('https://localhost/api'+endpoint, config);
      return response.data;
    };
  
    return fetchApi;
  };