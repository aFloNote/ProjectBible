import axios, { AxiosRequestConfig } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
export const UseApi = () => {
    const { getAccessTokenSilently } = useAuth0();
  
    const fetchApi = async <T>(endpoint: string, requireAuth = true,config: AxiosRequestConfig = {}): Promise<T> => {
      const domain = import.meta.env.VITE_REACT_APP_DOMAIN;
    
      if (!config.headers) {
        config.headers = {};
      }
    
      if (requireAuth) {
        const token = await getAccessTokenSilently();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      
      const response = await axios.get<T>(domain+'/api'+endpoint, config);
      return response.data;
    };
    
    const uploadApi = async <T, R>(endpoint: string, data: T, config: AxiosRequestConfig = {}, requireAuth = true): Promise<R> => {
      const domain = import.meta.env.VITE_REACT_APP_DOMAIN;  
    
      if (!config.headers) {
        config.headers = {};
      }
    
      if (requireAuth) {
        const token = await getAccessTokenSilently();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    
      const response = await axios.post<R>(domain +'/api'+ endpoint, data, {
        ...config,
      });
      return response.data;
    };

    const deleteApi = async <R>(endpoint: string, config: AxiosRequestConfig = {}): Promise<R> => {
      const domain = import.meta.env.VITE_REACT_APP_DOMAIN;
    
      if (!config.headers) {
        config.headers = {};
      }
    
      const token = await getAccessTokenSilently();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    
      const response = await axios.delete<R>(domain + '/api' + endpoint, config);
      return response.data;
    };
    
    return { fetchApi, uploadApi, deleteApi };
  };

  