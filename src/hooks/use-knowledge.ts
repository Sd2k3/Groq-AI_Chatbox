
import { useState, useCallback, useEffect } from 'react';
import { KnowledgeBase, KnowledgeStore } from '@/types/knowledge';

const getUniqueId = () => `kb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const useKnowledge = () => {
  const [state, setState] = useState<KnowledgeStore>(() => {
    const savedKnowledgeBases = localStorage.getItem('knowledgeBases');
    return {
      knowledgeBases: savedKnowledgeBases ? JSON.parse(savedKnowledgeBases) : [],
    };
  });

  useEffect(() => {
    localStorage.setItem('knowledgeBases', JSON.stringify(state.knowledgeBases));
  }, [state.knowledgeBases]);

  const addKnowledgeBase = useCallback((title: string, content: string) => {
    const newKnowledgeBase: KnowledgeBase = {
      id: getUniqueId(),
      title,
      content,
      isLocked: false,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      knowledgeBases: [...prev.knowledgeBases, newKnowledgeBase],
    }));
  }, []);

  const toggleLock = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      knowledgeBases: prev.knowledgeBases.map(kb =>
        kb.id === id ? { ...kb, isLocked: !kb.isLocked } : kb
      ),
    }));
  }, []);

  const deleteKnowledgeBase = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      knowledgeBases: prev.knowledgeBases.filter(kb => kb.id !== id),
    }));
  }, []);

  const searchKnowledgeBases = useCallback((query: string) => {
    const normalizedQuery = query.toLowerCase();
    return state.knowledgeBases
      .filter(kb => !kb.isLocked)
      .filter(kb => 
        kb.title.toLowerCase().includes(normalizedQuery) ||
        kb.content.toLowerCase().includes(normalizedQuery)
      );
  }, [state.knowledgeBases]);

  return {
    knowledgeBases: state.knowledgeBases,
    addKnowledgeBase,
    toggleLock,
    deleteKnowledgeBase,
    searchKnowledgeBases,
  };
};
