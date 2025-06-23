import React, { type FormEvent, useState } from 'react';
import type { BoardRequest, CategoryResponse } from '../types';

interface BoardFormProps {
  initialData?: BoardRequest;
  categories: CategoryResponse;
  onSubmit: (data: BoardRequest, file?: File) => Promise<void>;
}

const BoardForm: React.FC<BoardFormProps> = ({ initialData, categories, onSubmit }) => {
  const [formData, setFormData] = useState<BoardRequest>(
    initialData || { title: '', content: '', category: 'NOTICE' }
  );
  const [file, setFile] = useState<File | undefined>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData, file);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{initialData ? '글 수정' : '글 등록'}</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">제목</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">카테고리</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          {Object.entries(categories).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">내용</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full p-2 border rounded"
          rows={5}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">이미지 (선택)</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="w-full p-2 border rounded"
          accept="image/*"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        {initialData ? '수정' : '등록'}
      </button>
    </form>
  );
};

export default BoardForm;