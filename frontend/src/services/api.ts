import axios from 'axios';
import type { ApiResponse } from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          console.error('请求参数错误:', data.message);
          break;
        case 401:
          console.error('未登录或登录过期');
          // 可以在这里处理登录跳转
          break;
        case 413:
          console.error('文件过大');
          break;
        case 415:
          console.error('文件格式不支持');
          break;
        case 429:
          console.error('请求过于频繁');
          break;
        case 500:
          console.error('服务器错误');
          break;
        case 503:
          console.error('AI服务暂时不可用');
          break;
        default:
          console.error('请求失败:', data.message);
      }
    } else if (error.request) {
      console.error('网络错误，请检查网络连接');
    } else {
      console.error('请求错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;

// 通用请求方法
export async function request<T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: unknown,
  config?: object
): Promise<ApiResponse<T>> {
  const response = await api.request({
    method,
    url,
    data: method !== 'get' ? data : undefined,
    params: method === 'get' ? data : undefined,
    ...config,
  });
  return response as unknown as ApiResponse<T>;
}