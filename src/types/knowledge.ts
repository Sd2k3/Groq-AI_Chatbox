
export interface KnowledgeBase {
  id: string;
  title: string;
  content: string;
  isLocked: boolean;
  timestamp: number;
}

export interface KnowledgeStore {
  knowledgeBases: KnowledgeBase[];
}
