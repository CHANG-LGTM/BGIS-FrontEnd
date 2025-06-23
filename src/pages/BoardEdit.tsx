import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getBoard, updateBoard, getCategories } from '../api';
import BoardForm from '../components/BoardForm';
import type { BoardRequest, CategoryResponse } from '../types';
import { useParams, useNavigate } from 'react-router-dom';

const BoardEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: board, isLoading: boardLoading } = useQuery({
    queryKey: ['board', Number(id)],
    queryFn: () => getBoard(Number(id)),
  });
  const { data: categories, isLoading: categoriesLoading } = useQuery<CategoryResponse>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  const mutation = useMutation({
    mutationFn: ({ data, file }: { data: BoardRequest; file?: File }) => updateBoard(Number(id), data, file),
    onSuccess: () => {
      navigate(`/boards/${id}`);
    },
    onError: (error) => {
      alert(`글 수정 실패: ${(error as Error).message}`);
    },
  });

  const handleSubmit = async (data: BoardRequest, file?: File) => {
    await mutation.mutateAsync({ data, file });
  };

  if (boardLoading || categoriesLoading) return <div className="text-center">로딩 중...</div>;

  const initialData: BoardRequest = {
    title: board?.title || '',
    content: board?.content || '',
    category: board?.boardCategory || 'NOTICE',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <BoardForm initialData={initialData} categories={categories!} onSubmit={handleSubmit} />
    </div>
  );
};

export default BoardEdit;