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

  const totalPages = data ? data.totalPages : 0;

  // 글을 최신순 정렬 (프론트단에서 보정)
  const sortedContent = data?.content
    ? [...data.content].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">게시글 목록</h2>
      <div className="grid gap-4 w-full">
        {sortedContent.map((board) => (
          <div
            key={board.id}
            className="p-4 bg-white shadow-md rounded cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/boards/${board.id}`)}
          >
            <h3 className="text-lg font-semibold">{board.title}</h3>
            <p className="text-sm text-gray-600">{board.category}</p>
            <p className="text-sm text-gray-500">
              {new Date(board.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center mt-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-4 py-2 rounded ${
                i === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardList;
