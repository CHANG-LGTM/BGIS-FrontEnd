import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import BoardCreate from './pages/BoardCreate';
import BoardEdit from './pages/BoardEdit';
import BoardView from './pages/BoardView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/boards/create" element={<BoardCreate />} />
          <Route path="/boards/edit/:id" element={<BoardEdit />} />
          <Route path="/boards/:id" element={<BoardView />} />
          <Route path="/" element={<Signin />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;