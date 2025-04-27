
import { useState, FormEvent } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useKnowledge } from "@/hooks/use-knowledge";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading = false, className, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const { searchKnowledgeBases } = useKnowledge();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Search knowledge bases before sending
    const relevantKnowledge = searchKnowledgeBases(input);
    let finalMessage = input;
    
    if (relevantKnowledge.length > 0) {
      const contextStr = relevantKnowledge
        .map(kb => `${kb.title}:\n${kb.content}`)
        .join('\n\n');
      finalMessage = `[Knowledge Base Context:\n${contextStr}\n]\n\nUser Question: ${input}`;
    }
    
    onSend(finalMessage);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleSubmit(e as any);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Textarea
        placeholder="Type your message here..."
        className="min-h-20 sm:min-h-24 resize-none pr-14 text-base"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading || disabled}
        autoFocus
      />
      <Button 
        size="icon"
        type="submit"
        disabled={isLoading || !input.trim() || disabled}
        className="absolute bottom-4 right-4 h-10 w-10 rounded-full transition-all hover:scale-105"
      >
        <SendIcon className={cn("h-4 w-4", isLoading && "animate-pulse")} />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}
