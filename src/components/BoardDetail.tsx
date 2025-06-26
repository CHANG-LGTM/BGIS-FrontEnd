import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteBoard, getBoard } from '../api';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { BoardDetail } from '../types';

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const rawUserData = localStorage.getItem('user');
  const user = rawUserData ? JSON.parse(rawUserData) : null;

  const { data: board, isLoading, error } = useQuery<BoardDetail>({
    queryKey: ['board', id],
    queryFn: () => getBoard(Number(id)),
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationFn: () => deleteBoard(Number(id)),
    onSuccess: () => {
      alert('게시글이 삭제되었습니다.');
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    },
  });

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      mutate();
    }
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (error || !board) return <p>게시글을 불러오는 데 실패했습니다.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl w-full space-y-6">
        <h2 className="text-3xl font-bold">제목: {board.title}</h2>
        <p className="text-sm text-gray-600">작성자: {user?.name || ''}</p>
        <div className="text-sm text-gray-500">카테고리: {board.boardCategory}</div>
        <div className="text-gray-800 whitespace-pre-line">내용: {board.content}</div>

        {board.imageUrl && (
          <div className="mt-6 flex justify-center">
            <img
              src={`https://front-mission.bigs.or.kr${board.imageUrl}`}
              alt="첨부 이미지"
              className="max-w-md max-h-80 object-contain rounded shadow"
            />
          </div>
        )}

        <div className="flex justify-end gap-4 mt-8">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 min-w-[120px]"
            onClick={() => navigate(`/boards/edit/${board.id}`)}
          >
            수정
          </button>
          <button
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 min-w-[120px]"
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
