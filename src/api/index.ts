import axios from 'axios';
import type {
  SignupRequest,
  SigninRequest,
  AuthResponse,
  BoardRequest,
  BoardResponse,
  BoardDetail,
  BoardListResponse,
  CategoryResponse,
} from '../types';

// 토큰 저장 및 갱신 함수
const saveToken = (accessToken: string, refreshToken?: string) => {
  const cleanAccessToken = accessToken.startsWith('Bearer ') ? accessToken.replace('Bearer ', '') : accessToken;
  const cleanRefreshToken =
    refreshToken && (refreshToken.startsWith('Bearer ') ? refreshToken.replace('Bearer ', '') : refreshToken);

  localStorage.setItem('accessToken', cleanAccessToken);
  if (cleanRefreshToken) localStorage.setItem('refreshToken', cleanRefreshToken);
};

const getToken = () => ({
  accessToken: localStorage.getItem('accessToken') || '',
  refreshToken: localStorage.getItem('refreshToken') || '',
});

const BASE_URL = 'https://front-mission.bigs.or.kr';
const AUTH_URL = 'https://front-mission.bigs.or.kr';

// Axios 인스턴스
export const api = axios.create({
  baseURL: BASE_URL,
});

// 회원가입
export const signup = async (data: SignupRequest): Promise<void> => {
  await fetch(`${AUTH_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

// 로그인
export const signin = async (data: SigninRequest): Promise<AuthResponse> => {
  const response = await fetch(`${AUTH_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`로그인 실패: ${response.status}`);
  }

  const result = await response.json();
  const { accessToken, refreshToken, user } = result;

  saveToken(accessToken, refreshToken);

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    try {
      const base64Url = accessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );

      const payload = JSON.parse(jsonPayload);

      localStorage.setItem(
        'user',
        JSON.stringify({
          username: payload.username,
          name: payload.name,
        })
      );
    } catch (err) {
      console.error('JWT decode 실패:', err);
    }
  }

  return result;
};

// 토큰 갱신
export const refreshToken = async (): Promise<AuthResponse> => {
  const { refreshToken } = getToken();
  if (!refreshToken) throw new Error('No refresh token available. Please sign in first.');

  const response = await fetch(`${AUTH_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`리프레쉬 토큰 갱신 실패: ${response.status}`);
  }

  const result = await response.json();
  saveToken(result.accessToken, result.refreshToken);

  return result;
};

// 게시글 생성
export const createBoard = async (data: BoardRequest, file?: File): Promise<BoardResponse> => {
  const { accessToken } = getToken();
  if (!accessToken) throw new Error('No access token available. Please sign in first.');

  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (file) formData.append('file', file);

  const response = await api.post('/boards', formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

// 게시글 수정
export const updateBoard = async (
  boardId: number,
  data: BoardRequest,
  file?: File | null,
  isImageDeleted = false
): Promise<void> => {
  const { accessToken } = getToken();
  if (!accessToken) throw new Error('No access token available. Please sign in first.');

  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (file) formData.append('file', file);
  if (isImageDeleted) formData.append('deleteImage', 'true');

  await api.patch(`/boards/${boardId}`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// 게시글 삭제
export const deleteBoard = async (id: number): Promise<void> => {
  const { accessToken } = getToken();
  if (!accessToken) throw new Error('No access token available. Please sign in first.');

  await api.delete(`/boards/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// 게시글 상세 조회
export const getBoardDetail = async (id: number): Promise<BoardDetail> => {
  const { accessToken } = getToken();
  if (!accessToken) throw new Error('No access token available. Please sign in first.');

  const response = await api.get(`/boards/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

// getBoard 별칭 제공
export const getBoard = getBoardDetail;

// 게시글 목록 조회
export const getBoards = async (page: number, size: number, search = '', categoryFilter = ''): Promise<BoardListResponse> => {
  const { accessToken } = getToken();
  if (!accessToken) throw new Error('No access token available. Please sign in first.');

  const url = `/boards?page=${page}&size=${size}&search=${search}&category=${categoryFilter}`;

  const response = await api.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

// 카테고리 조회
export const getCategories = async (): Promise<CategoryResponse> => {
  const { accessToken } = getToken();
  if (!accessToken) throw new Error('No access token available. Please sign in first.');

  const response = await api.get('/boards/categories', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

// 이미지 절대경로 변환 함수
export const getFullImageUrl = (imageUrl: string | null | undefined) => {
  if (!imageUrl) return null;
  return imageUrl.startsWith('http') ? imageUrl : `https://front-mission.bigs.or.kr${imageUrl}`;
};
