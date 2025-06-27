
import { useQuery } from '@tanstack/react-query';
import config from '@/config.json';

interface PostMetadata {
  tags: string[];
  users: string[];
  image: string[];
  links: string[];
  app: string;
  format: string;
}

interface PostStats {
  net_votes: number;
  children: number;
  payout: string;
  author_reputation: string;
}

interface Voter {
  voter: string;
  weight: number;
  rshares: string;
  percent: number;
  reputation: number;
  time: string;
}

interface PostData {
  id: number;
  author: string;
  permlink: string;
  title: string;
  body: string;
  created: string;
  last_update: string;
  category: string;
  metadata: PostMetadata;
  stats: PostStats;
  voters: Voter[];
  voters_count: number;
  url: string;
}

export const usePostDetails = (author: string | undefined, permlink: string | undefined) => {
  return useQuery({
    queryKey: ['post', author, permlink],
    queryFn: async (): Promise<PostData> => {
      if (!author || !permlink) {
        throw new Error('Author and permlink are required');
      }
      
      const response = await fetch(`${config.blazer_api}/posts_api/getPost?author=${author}&permlink=${permlink}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch post details');
      }
      
      return response.json();
    },
    enabled: !!author && !!permlink,
    staleTime: 60000, // Cache for 1 minute
  });
};
