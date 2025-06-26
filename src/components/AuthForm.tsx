import React, { type FormEvent, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import type { SignupRequest, SigninRequest } from '../types';

// 유효성 검사 함수
const validateusername = (username: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
const validateSignupPassword = (password: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!%*#?&])[A-Za-z\d!@%*#?&]{8,}$/.test(password);

interface AuthFormProps {
  type: 'signup' | 'signin';
  onSubmit?: (data: SignupRequest | SigninRequest) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const initialFormData = type === 'signin'
    ? { username: '', password: '' }
    : { username: '', password: '', name: '', confirmPassword: '' };

  const [formData, setFormData] = useState<SignupRequest | SigninRequest>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.username || !validateusername(formData.username)) {
      errors.username = '유효한 이메일 형식이어야 합니다.';
    }

    if (!formData.password || !validateSignupPassword(formData.password)) {
      errors.password = '8자 이상, 숫자, 영문자, 특수문자 중 1개 이상 필요합니다.';
    }

    if (type === 'signup') {
      const signupData = formData as SignupRequest;

      if (!signupData.name.trim()) {
        errors.name = '사용자 이름을 입력하세요.';
      }

      if (!signupData.confirmPassword) {
        errors.confirmPassword = '비밀번호 확인을 입력하세요.';
      } else if (signupData.password !== signupData.confirmPassword) {
        errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError(null);
    setLoading(true);

    if (onSubmit) {
      console.log('Calling onSubmit with data:', formData);
      try {
        await onSubmit(formData);
        console.log('onSubmit completed');
      } catch (error) {
        console.error('onSubmit Error:', error);
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
            error.response?.data?.error ||
            `API 요청 실패: ${error.message}`
          );
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{type === 'signup' ? '회원가입' : '로그인'}</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-medium">이메일</label>
        <input
          type="username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className={`w-full p-2 border rounded ${formErrors.username ? 'border-red-500' : ''}`}
          required
          disabled={loading}
        />
        {formErrors.username && <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>}
      </div>

      {type === 'signup' && (
        <div className="mb-4">
          <label className="block text-sm font-medium">이름</label>
          <input
            type="text"
            value={(formData as SignupRequest).name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : ''}`}
            required
            disabled={loading}
          />
          {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium">비밀번호</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className={`w-full p-2 border rounded ${formErrors.password ? 'border-red-500' : ''}`}
          required
          disabled={loading}
        />
        {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
      </div>

      {type === 'signup' && (
        <div className="mb-4">
          <label className="block text-sm font-medium">비밀번호 확인</label>
          <input
            type="password"
            value={(formData as SignupRequest).confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className={`w-full p-2 border rounded ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
            required
            disabled={loading}
          />
          {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
        </div>
      )}

      <button
        type="submit"
        className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? '처리 중...' : type === 'signup' ? '가입' : '로그인'}
      </button>

      <div className="mt-4 text-center">
        {type === 'signin' ? (
          <p className="text-sm">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              회원가입
            </Link>
          </p>
        ) : (
          <p className="text-sm">
            이미 계정이 있으신가요?{' '}
            <Link to="/" className="text-blue-500 hover:underline">
              로그인
            </Link>
          </p>
        )}
      </div>
    </form>
  );
};

export default AuthForm;