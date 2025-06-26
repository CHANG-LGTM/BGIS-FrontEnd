import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createBoard, getCategories } from '../api';
import BoardForm from '../components/BoardForm';
import type { BoardRequest, CategoryResponse } from '../types';
import { useNavigate } from 'react-router-dom';

const BoardCreate: React.FC = () => {
  const navigate = useNavigate();

  const { data: categories, isLoading, error } = useQuery<CategoryResponse>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { mutate } = useMutation({
    mutationFn: ({ data, file }: { data: BoardRequest; file?: File | null }) =>
      createBoard(data, file || undefined),
    onSuccess: () => {
      alert('게시글이 등록되었습니다.');
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('게시글 등록 실패:', error);
      alert('게시글 등록에 실패했습니다.');
    },
  });

  const handleSubmit = (data: BoardRequest, file?: File | null) => {
    mutate({ data, file });
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>카테고리를 불러오는 데 실패했습니다.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <BoardForm categories={categories!} onSubmit={handleSubmit} initialData={undefined} />
    </div>
  );
};

export default BoardCreate;
