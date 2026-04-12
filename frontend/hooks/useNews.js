"use client";
import { useQuery } from '@tanstack/react-query';
import { getNews }  from '@/lib/api';
 
export function useNews({ category, page = 1 } = {}) {
  return useQuery({
    queryKey: ["news", category, page],
    queryFn:  () => getNews({ category, page }),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
}