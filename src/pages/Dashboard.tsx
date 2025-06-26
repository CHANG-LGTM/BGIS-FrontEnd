import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBoards } from '../api';
import BoardList from '../components/BoardList';
import type { BoardListResponse, User } from '../types';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [page, setPage] = useState(0);
  const size = 10;
  const navigate = useNavigate();

  const rawUserData = localStorage.getItem('user');
  console.log('Raw localStorage user:', rawUserData);

  const user: User | null = rawUserData ? JSON.parse(rawUserData) : null;
  console.log('Parsed user:', user);

  const { data: boardsData, isLoading } = useQuery<BoardListResponse>({
    queryKey: ['boards', page, size],
    queryFn: () => getBoards(page, size),
  });

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.clear();
      navigate('/signin');
    }
  };

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
              환영합니다, {user?.name || user?.username.split('@')[0] || '사용자'}님!
            </h2>
            <p className="text-sm text-gray-600">이메일: {user.username}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/boards/create')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              글쓰기
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              로그아웃
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center">게시물 로딩 중...</div>
        ) : (
          <BoardList page={page} size={size} setPage={setPage} boards={boardsData?.content || []} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
