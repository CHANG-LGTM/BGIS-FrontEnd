import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createBoard, getCategories } from '../api';
import BoardForm from '../components/BoardForm';
import type { BoardRequest, CategoryResponse } from '../types';
import { useNavigate } from 'react-router-dom';

const BoardCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useQuery<CategoryResponse>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  const mutation = useMutation({
    mutationFn: ({ data, file }: { data: BoardRequest; file?: File }) => createBoard(data, file),
    onSuccess: () => {
      navigate('/dashboard');
    },
    onError: (error) => {
      alert(`글 등록 실패: ${(error as Error).message}`);
    },
  });

  const handleSubmit = async (data: BoardRequest, file?: File) => {
    await mutation.mutateAsync({ data, file });
  };

  if (isLoading) return <div className="text-center">카테고리 로딩 중...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <BoardForm categories={categories!} onSubmit={handleSubmit} />
    </div>
  );
};

export default BoardCreate;