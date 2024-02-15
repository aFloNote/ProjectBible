import { UseApi } from '@/hooks/apiAuth';
import { useQuery, useMutation } from 'react-query';

export interface Author {
  author_id: number;
  name: string;
  ministry: string;
  imagePath: string;
}

export function FetchAuthor() {
 
  const fetchApi = UseApi();

  // Async function to fetch author data
  const fetchAuthorData = async () => {
    const response = await fetchApi<Author[]>('/fetchauthors');
    return response;
  }

  // Using useQuery hook to fetch data
  const { data, error, isLoading } = useQuery<Author[], Error>("AuthorData", fetchAuthorData, {
    staleTime: 5 * 60 * 1000, // 5 minutes in milliseconds
    cacheTime: 15 * 60 * 1000, // 15 minutes in milliseconds
  });

  // Return data, error, and loading state
  return { data, error, isLoading };
}




export function CreateAuthor() {
  const fetchApi = UseApi();

  // Async function to create author data
  const createAuthorData = async (author: Author) => {
    // Adjust the URL and method according to your API's requirements
    const response = await fetchApi<Author>('/createauthor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(author),
    });
    return response;
  };

  // Using useMutation hook for the creation operation
  const { mutate, data, error, isLoading } = useMutation(createAuthorData, {
    // Optionally, you can specify onSuccess, onError, onSettled callbacks here
  });

  // Return the mutation function and state
  return { mutate, data, error, isLoading };
}