
import { useQuery } from '@tanstack/react-query';

interface DApp {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  status: 'active' | 'beta' | 'development';
  features: string[];
  developer: string;
}

const fetchEcosystemData = async (): Promise<DApp[]> => {
  const response = await fetch('https://raw.githubusercontent.com/blazeapps007/BlazeDB/refs/heads/Blazed/Ecosystem.json');
  if (!response.ok) {
    throw new Error('Failed to fetch ecosystem data');
  }
  return response.json();
};

export const useEcosystemData = () => {
  return useQuery({
    queryKey: ['ecosystem-data'],
    queryFn: fetchEcosystemData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });
};
