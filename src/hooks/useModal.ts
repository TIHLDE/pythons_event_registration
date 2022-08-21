import { useState } from 'react';

export const useModal = (initialMode = false) => {
  const [modalOpen, setModalOpen] = useState(initialMode);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  return { modalOpen, handleOpenModal, handleCloseModal };
};
