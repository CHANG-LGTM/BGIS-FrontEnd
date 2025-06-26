import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBoards } from '../api';
import type { BoardListResponse } from '../types';
import { useNavigate } from 'react-router-dom';

interface BoardListProps {
  page: number;
  size: number;
  setPage: (page: number) => void;
}

const BoardList: React.FC<BoardListProps> = ({ page, size, setPage }) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery<BoardListResponse>({
    queryKey: ['boards', page, size],
    queryFn: () => getBoards(page, size),
  });

  if (isLoading) return <div className="text-center">로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">오류: {(error as Error).message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">게시글 목록</h2>
      <div className="grid gap-4">
        {data?.content.map((board) => (
          <div
            key={board.id}
            className="p-4 bg-white shadow-md rounded cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/boards/${board.id}`)}
          >
            <h3 className="text-lg font-semibold">{board.title}</h3>
            <p className="text-sm text-gray-600">{board.category}</p>
            <p className="text-sm text-gray-500">{new Date(board.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
        >
          이전
        </button>
        <span className="px-4 py-2">{page + 1}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={data?.last}
          className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default BoardList;