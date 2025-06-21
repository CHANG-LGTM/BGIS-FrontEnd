import React from 'react';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-blue-500 text-white rounded-lg shadow-md md:bg-green-500">
        <h1 className="text-2xl font-bold">Tailwind CSS 테스트</h1>
        <p className="mt-2">화면 크기를 조정하여 배경색 변화를 확인하세요.</p>
      </div>
    </div>
  );
};

export default App;