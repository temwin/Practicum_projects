import { useState, useCallback } from 'react';

export interface SkillData {
  title: string;
  category: string;
  description: string;
}

export const useRegistrationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [skillData, setSkillData] = useState<SkillData>({
    title: '',
    category: '',
    description: '',
  });

  const openModal = useCallback((data: SkillData) => {
    setSkillData(data);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    skillData,
    openModal,
    closeModal,
  };
};
