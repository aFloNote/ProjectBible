import { UseApi } from '@/hooks/apiAuth';
import { useQuery, useMutation } from 'react-query';



interface UploadResponse {
  message: string;
  // other fields...
}



export function Upload(endpoint: string) {
 
  const {uploadApi} = UseApi();

  const uploadData = async (formData: FormData) => {
   
    
    return await uploadApi<FormData,UploadResponse>('/'+endpoint, formData);
  };

  // useMutation hook setup correctly
  const { data, error, isLoading, mutate } = useMutation(uploadData);

  // Return data, error, and loading state
  return { data, error, isLoading,mutate };
}

export function Fetch<TData>(endPoint: string, queryKey: string, requireAuth=true) {
  const fetchApi = UseApi().fetchApi;

  // Async function to fetch data
  const fetchData = async () => {
    console.log('endPoint '+endPoint)
    const response = await fetchApi<TData>('/' + endPoint, requireAuth);
    return response;
  }

  // Using useQuery hook to fetch data
  const { data, error, isLoading } = useQuery<TData>(queryKey, fetchData);

  // Return data, error, and loading state
  return { data, error, isLoading };
}