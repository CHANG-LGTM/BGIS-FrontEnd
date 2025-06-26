import React, { useState, useEffect } from 'react';
import type { BoardRequest, CategoryResponse } from '../types';

interface BoardFormProps {
  initialData?: BoardRequest;
  categories: CategoryResponse;
  onSubmit: (data: BoardRequest, file?: File | null) => void;
  initialImageUrl?: string | null;
  removeImage?: boolean;
  setRemoveImage?: (remove: boolean) => void;
  isEdit?: boolean;
}

const BoardForm: React.FC<BoardFormProps> = ({
  initialData,
  categories,
  onSubmit,
  initialImageUrl = null,
  setRemoveImage,
  isEdit = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || '');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setRemoveImage?.(false);
    }
  }, [file]);

  useEffect(() => {
    setPreviewUrl(initialImageUrl);
  }, [initialImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setRemoveImage?.(false);
    } else {
      setPreviewUrl(initialImageUrl);
    }
  };

  const handleImageDelete = () => {
    setFile(null);
    setPreviewUrl(null);
    setRemoveImage?.(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedCategory) {
      alert('제목, 내용, 카테고리를 모두 입력하세요.');
      return;
    }
    onSubmit({ title, content, category: selectedCategory }, file);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? '게시글 수정' : '글 작성'}</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded h-40"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">카테고리</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">카테고리를 선택하세요</option>
          {Object.entries(categories).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">첨부 이미지</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
        {previewUrl && (
          <div className="flex flex-col items-center mt-2 space-y-2">
            <img src={previewUrl} alt="미리보기" className="max-h-40 object-contain" />
            {isEdit && (
              <button
                type="button"
                onClick={handleImageDelete}
                className="text-sm text-red-500 hover:underline"
              >
                사진 삭제
              </button>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {isEdit ? '수정 완료' : '작성 완료'}
      </button>
    </form>
  );
};

export default BoardForm;
