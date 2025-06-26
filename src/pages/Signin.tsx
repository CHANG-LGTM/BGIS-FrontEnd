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
        const base64Url = data.accessToken.split('.')[1];
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
            username: payload.username || '',
            name: payload.name || '',
          })
        );

        navigate('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        
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
