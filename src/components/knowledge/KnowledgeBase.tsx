
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Lock, Unlock, Trash2 } from "lucide-react";
import { KnowledgeBase as KnowledgeBaseType } from '@/types/knowledge';

interface KnowledgeBaseProps {
  knowledgeBase: KnowledgeBaseType;
  onToggleLock: (id: string) => void;
  onDelete: (id: string) => void;
}

export function KnowledgeBase({ knowledgeBase, onToggleLock, onDelete }: KnowledgeBaseProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{knowledgeBase.title}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleLock(knowledgeBase.id)}
            className="h-8 w-8"
          >
            {knowledgeBase.isLocked ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(knowledgeBase.id)}
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p className="line-clamp-3">{knowledgeBase.content}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Added: {new Date(knowledgeBase.timestamp).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}
