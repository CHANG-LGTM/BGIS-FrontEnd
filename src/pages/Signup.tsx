import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { signup } from '../api';
import AuthForm from '../components/AuthForm';
import type { SigninRequest, SignupRequest } from '../types';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      navigate('/signin');
    },
    onError: (error) => {
      alert(`회원가입 실패: ${(error as Error).message}`);
    },
  });

  const handleSubmit = async (data: SignupRequest | SigninRequest) => {
    await mutation.mutateAsync(data as SignupRequest);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm type="signup" onSubmit={handleSubmit} />
    </div>
  );
};

export default Signup;