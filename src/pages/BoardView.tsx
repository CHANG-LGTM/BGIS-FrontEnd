import React from 'react';
import BoardDetail from '../components/BoardDetail';
import { useParams } from 'react-router-dom';

const BoardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <BoardDetail id={Number(id)} />
    </div>
  );
};

export default BoardView;