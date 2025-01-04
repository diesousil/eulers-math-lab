import api from './api';
import Result from '@/types/Result';

export async function runQuery(query: String) : Promise<Result> {
  const response = await api.get(`/expression/${query}`);
  return response.data;
};