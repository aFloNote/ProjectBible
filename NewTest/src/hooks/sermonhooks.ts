import { UseApi } from '@/hooks/apiAuth';
import { useQuery, useMutation } from 'react-query';

export interface Author {
  author_id: number;
  name: string;
  ministry: string;
  imagePath: string;
}
interface UploadResponse {
  message: string;
  // other fields...
}


export function FetchAuthor() {
 
  const fetchApi = UseApi().fetchApi;

  // Async function to fetch author data
  const fetchAuthorData = async () => {
    const response = await fetchApi<Author[]>('/fetchauthors');
    return response;
  }

  // Using useQuery hook to fetch data
  const { data, error, isLoading } = useQuery<Author[], Error>("AuthorData", fetchAuthorData, {
    staleTime: 1 * 60 * 1000, // 5 minutes in milliseconds
    cacheTime: 1 * 60 * 1000, // 15 minutes in milliseconds
  });

  // Return data, error, and loading state
  return { data, error, isLoading };
}
export function uploadAuthor() {
 
  const {uploadApi} = UseApi();

  const uploadAuthorData = async (formData: FormData) => {
   
    
    return await uploadApi<FormData,UploadResponse>('/uploadauthors', formData);
  };

  // useMutation hook setup correctly
  const { data, error, isLoading, mutate } = useMutation(uploadAuthorData);

  // Return data, error, and loading state
  return { data, error, isLoading,mutate };
}

