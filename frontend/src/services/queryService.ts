import api from './api';
import Result from '@/types/Result';

export async function runQuery(query: string) : Promise<Result> {
  const encodedQuery = encodeURIComponent(query);
  console.log(encodedQuery);
  const response = await api.get(`/expression/${encodedQuery}`);
  return response.data;
};