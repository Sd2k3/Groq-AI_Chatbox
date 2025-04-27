
import React from 'react';
import { useKnowledge } from '@/hooks/use-knowledge';
import { KnowledgeBase } from './KnowledgeBase';
import { KnowledgeBaseForm } from './KnowledgeBaseForm';

export function KnowledgeManager() {
  const { knowledgeBases, addKnowledgeBase, toggleLock, deleteKnowledgeBase } = useKnowledge();

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Add New Knowledge Base</h3>
        <KnowledgeBaseForm onSubmit={addKnowledgeBase} />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Knowledge Bases</h3>
        {knowledgeBases.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No knowledge bases added yet. Add one above to get started.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {knowledgeBases.map((kb) => (
              <KnowledgeBase
                key={kb.id}
                knowledgeBase={kb}
                onToggleLock={toggleLock}
                onDelete={deleteKnowledgeBase}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
