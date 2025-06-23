import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { signin } from '../api';
import AuthForm from '../components/AuthForm';
import type { SigninRequest, AuthResponse } from '../types';
import { useNavigate } from 'react-router-dom';

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      // API에서 사용자 정보를 직접 반환하지 않으므로, JWT 디코딩 또는 별도 저장
      const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
      localStorage.setItem('user', JSON.stringify({ username: payload.username, name: payload.name }));
      navigate('/dashboard');
    },
    onError: (error) => {
      alert(`로그인 실패: ${(error as Error).message}`);
    },
  });

  const handleSubmit = async (data: SigninRequest | SigninRequest) => {
    await mutation.mutateAsync(data as SigninRequest);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm type="signin" onSubmit={handleSubmit} />
    </div>
  );
};

export default Signin;