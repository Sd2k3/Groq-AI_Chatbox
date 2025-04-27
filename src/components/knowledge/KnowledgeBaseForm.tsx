
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface KnowledgeBaseFormProps {
  onSubmit: (title: string, content: string) => void;
}

export function KnowledgeBaseForm({ onSubmit }: KnowledgeBaseFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    onSubmit(title, content);
    setTitle("");
    setContent("");
    
    toast({
      title: "Success",
      description: "Knowledge base added successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Knowledge Base Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <Textarea
          placeholder="Enter your knowledge base content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <Button type="submit" className="w-full">
        Add Knowledge Base
      </Button>
    </form>
  );
}
