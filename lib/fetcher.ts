import { baseAPI } from './axios';

export const fetcher = (url: string) => baseAPI.get(url).then(res => res.data);