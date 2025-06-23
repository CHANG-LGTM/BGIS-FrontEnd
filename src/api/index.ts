import axios, { type AxiosInstance } from 'axios';
import type { SignupRequest, SigninRequest, AuthResponse, RefreshRequest, BoardRequest, BoardResponse, BoardDetail, BoardListResponse, CategoryResponse } from '../types';

const api: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi: AxiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
  },
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = async (data: SignupRequest): Promise<void> => {
  try {
    const response = await api.post('/auth/signup', data);
    if (response.status === 204 || response.status === 200) {
      console.log('Signup successful:', { status: response.status, data: response.data });
      return;
    }
    throw new Error(`Unexpected status: ${response.status} - ${JSON.stringify(response.data)}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Signup Error:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
      throw error.response?.data || error.message;
    }
    throw new Error('Unknown signup error');
  }
};

export const signin = async (data: SigninRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signin', data);
  return response.data;
};

export const refreshToken = async (data: RefreshRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/refresh', data);
  return response.data;
};

export const createBoard = async (data: BoardRequest, file?: File): Promise<BoardResponse> => {
  const formData = new FormData();
  formData.append('request', JSON.stringify(data));
  if (file) {
    formData.append('file', file);
  }
  const response = await authApi.post<BoardResponse>('/boards', formData);
  return response.data;
};

export const updateBoard = async (id: number, data: BoardRequest, file?: File): Promise<void> => {
  const formData = new FormData();
  formData.append('request', JSON.stringify(data));
  if (file) {
    formData.append('file', file);
  }
  await authApi.patch(`/boards/${id}`, formData);
};

export const deleteBoard = async (id: number): Promise<void> => {
  await authApi.delete(`/boards/${id}`);
};

export const getBoard = async (id: number): Promise<BoardDetail> => {
  const response = await authApi.get<BoardDetail>(`/boards/${id}`);
  return response.data;
};

export const getBoards = async (page: number, size: number): Promise<BoardListResponse> => {
  const response = await authApi.get<BoardListResponse>(`/boards?page=${page}&size=${size}`);
  return response.data;
};

export const getCategories = async (): Promise<CategoryResponse> => {
  const response = await authApi.get<CategoryResponse>('/boards/categories');
  return response.data;
};