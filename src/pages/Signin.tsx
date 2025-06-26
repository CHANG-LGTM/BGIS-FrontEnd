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
    try {
      const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
      console.log('payload:', payload);

      localStorage.setItem('user', JSON.stringify({
        username: payload.username || '',
        name: payload.name || ''
      }));

      navigate('/dashboard');
    } catch (error) {
      console.error('JWT decode error:', error);
      alert('로그인 후 사용자 정보 처리에 실패했습니다.');
    }
  },

  onError: (error) => {
    alert(`로그인 실패: ${(error as Error).message}`);
  },
});

  const handleSubmit = async (data: SigninRequest) => {
    await mutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm type="signin" onSubmit={handleSubmit} />
    </div>
  );
};

export default Signin;
