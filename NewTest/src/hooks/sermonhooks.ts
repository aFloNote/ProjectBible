import { UseApi } from "@/hooks/apiAuth";
import { useQuery, useMutation } from "react-query";

interface UploadResponse {
  message: string;
  // other fields...
}

export function Upload(endpoint: string) {
  const { uploadApi } = UseApi();

  const uploadData = async (formData: FormData) => {
    return await uploadApi<FormData, UploadResponse>("/" + endpoint, formData);
  };

  // useMutation hook setup correctly
  const { data, error, isLoading, mutate } = useMutation(uploadData);

  // Return data, error, and loading state
  return { data, error, isLoading, mutate };
}

export function Fetch<TData>(
  endPoint: string,
  queryKey: string,
  requireAuth = true,
  enabled = true
) {
  const fetchApi = UseApi().fetchApi;

  const fetchData = async () => {
    const response = await fetchApi<TData>("/" + endPoint, requireAuth);
    return response;
  };

  const { data, error, isLoading } = useQuery<TData>(queryKey, fetchData, {
    enabled,
  });

  return { data, error, isLoading };
}

export function Delete(endpoint: string) {
  const { deleteApi } = UseApi();

  const deleteData = async ({ id, slug }: { id: string; slug: string }) => {
    return await deleteApi(`/` + endpoint + `?id=${id}&slug=${slug}`);
  };

  // useMutation hook setup correctly
  const { data, error, isLoading, mutate } = useMutation(deleteData);

  // Return data, error, and loading state
  return { data, error, isLoading, mutate };
}

export function SearchFetch<TData>(
  endPoint: string,
  queryKey: string,
  requireAuth = true,
  enableSearchQuery: boolean
) {
  const fetchApi = UseApi().fetchApi;

  const fetchData = async (): Promise<TData> => {
    // Check if the 'query' parameter in the endPoint is not empty
    const url = new URL(endPoint, "http://dummy.com"); // Use a dummy base URL to create a URL object
    const query = url.searchParams.get("query");

    if (query && query.trim() !== "") {
      const response = await fetchApi<TData>("/" + endPoint, false);
      return response;
    }

    // Return a default value if the query parameter is empty
    return Promise.resolve({} as TData);
  };

  const { data, error, isLoading, refetch } = useQuery<TData>(
    queryKey,
    fetchData,
    { enabled: enableSearchQuery }
  );

  return { data, error, isLoading, refetch };
}

export function SearchPageFetch<TData>(endPoint: string, queryKey: string) {
  const fetchApi = UseApi().fetchApi;

  const fetchData = async (): Promise<TData> => {
    // Check if the 'query' parameter in the endPoint is not empty

    const response = await fetchApi<TData>("/" + endPoint,false);
    return response;

    // Return a default value if the query parameter is empty
  };

  const { data, error, isLoading, refetch } = useQuery<TData>(
    queryKey,
    fetchData,
    {
      cacheTime: 0, // Disable caching
    }
  );

  return { data, error, isLoading, refetch };
}
