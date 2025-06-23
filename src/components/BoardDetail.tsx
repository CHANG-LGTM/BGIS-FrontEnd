import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBoard, deleteBoard } from '../api';
import type { BoardDetail } from '../types';
import { useNavigate } from 'react-router-dom';

interface BoardDetailProps {
  id: number;
}

const BoardDetail: React.FC<BoardDetailProps> = ({ id }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<BoardDetail>({
    queryKey: ['board', id],
    queryFn: () => getBoard(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBoard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      navigate('/dashboard');
    },
  });

  if (isLoading) return <div className="text-center">로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">오류: {(error as Error).message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{data?.title}</h2>
      <p className="text-sm text-gray-600 mb-2">카테고리: {data?.boardCategory}</p>
      <p className="text-sm text-gray-500 mb-4">
        작성일: {new Date(data?.createdAt || '').toLocaleDateString()}
      </p>
      <p className="mb-4">{data?.content}</p>
      {data?.imageUrl && (
        <img src={`API_BASE_URL${data.imageUrl}`} alt="게시글 이미지" className="max-w-full h-auto mb-4" />
      )}
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/boards/edit/${id}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          수정
        </button>
        <button
          onClick={() => deleteMutation.mutate()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default BoardDetail;