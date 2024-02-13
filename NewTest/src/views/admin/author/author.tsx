import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

interface AuthorData {
  id: number;
  // Add other fields as per your data structure
}

// Step 1: Create an Axios Instance
const api = axios.create({
  baseURL: 'https://localhost/api', // Adjust this as necessary
});

function Author() {
  const [data, setData] = useState<AuthorData | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // Step 2: Set Up an Interceptor
    const setupAxiosInterceptors = async () => {
<<<<<<< HEAD
      const token = await getAccessTokenSilently();
=======
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://sermon.api",
          scope: "read:authors",
          }});
>>>>>>> test
      console.log(token);
      api.interceptors.request.use(config => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }, error => {
        return Promise.reject(error);
      });
    };

    const fetchData = async () => {
      try {
        await setupAxiosInterceptors(); // Ensure the interceptor is set up before making the call
        const response = await api.get<AuthorData>('/private'); // Step 3: Use the Axios instance
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [getAccessTokenSilently]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Data Received:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Author;