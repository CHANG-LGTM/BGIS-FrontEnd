import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getBoard, getCategories, updateBoard, getFullImageUrl } from '../api';
import BoardForm from '../components/BoardForm';
import type { BoardRequest, CategoryResponse, BoardDetail } from '../types';
import { useNavigate, useParams } from 'react-router-dom';

const BoardEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<BoardRequest | null>(null);
  const [originalData, setOriginalData] = useState<BoardRequest | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const { data: boardDetail } = useQuery<BoardDetail>({
    queryKey: ['board', id],
    queryFn: () => getBoard(Number(id)),
    enabled: !!id,
  });

  const { data: categories } = useQuery<CategoryResponse>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (boardDetail) {
      const boardData = {
        title: boardDetail.title,
        content: boardDetail.content,
        category: boardDetail.category,
      };
      setInitialData(boardData);
      setOriginalData(boardData);
      setImageUrl(getFullImageUrl(boardDetail.imageUrl));
      setIsImageDeleted(false);
    }
  }, [boardDetail]);

  const { mutate } = useMutation({
    mutationFn: ({ data, file }: { data: BoardRequest; file?: File | null }) => {
      return updateBoard(Number(id), data, file);
    },
    onSuccess: () => {
      alert('게시글이 수정되었습니다.');
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정에 실패했습니다.');
    },
  });

  const handleSubmit = (data: BoardRequest, file?: File | null) => {
    if (!originalData) return;

    const isTitleChanged = data.title !== originalData.title;
    const isContentChanged = data.content !== originalData.content;
    const isCategoryChanged = data.category !== originalData.category;
    const isFileChanged = !!file || isImageDeleted;

    const hasChanges = isTitleChanged || isContentChanged || isCategoryChanged || isFileChanged;

    if (!hasChanges) {
      if (window.confirm('변경사항이 없습니다. 그래도 저장하시겠습니까?')) {
        navigate('/dashboard');
      }
      return;
    }

    // 사진 삭제 버튼을 누른 경우 file을 명시적으로 null로 전달
    mutate({ data, file: isImageDeleted ? null : file });
  };

  if (!categories || !initialData) return <p>로딩 중...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <BoardForm
        initialData={initialData}
        categories={categories}
        onSubmit={handleSubmit}
        initialImageUrl={imageUrl}
        isEdit
        onImageDelete={() => setIsImageDeleted(true)}
      />
    </div>
  );
};

export default BoardEdit;
