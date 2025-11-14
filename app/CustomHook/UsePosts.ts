import { fetcher } from "@/lib/fetcher";
import useSWR from 'swr';

export function usePosts() {
    const { data, error, isLoading, mutate } = useSWR(
        `/post`,
        fetcher
    );

    return {
        posts: data,
        error,
        isLoading,
        mutateUser: mutate,
    }
}