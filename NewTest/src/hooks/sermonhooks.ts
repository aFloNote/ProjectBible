import { UseApi } from '@/hooks/apiAuth';
import { useQuery } from 'react-query';
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
    staleTime: 1 * 60 * 1000, // 5 minutes in milliseconds
    cacheTime: 1 * 60 * 1000, // 15 minutes in milliseconds
  });

  // Return data, error, and loading state
  return { data, error, isLoading };
}