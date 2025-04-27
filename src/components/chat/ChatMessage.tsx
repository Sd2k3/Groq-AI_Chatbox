
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { User, Bot, MessageSquareText } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

// Helper function to format code blocks in messages
const formatMessageContent = (content: string): React.ReactNode => {
  // Simple regex to find code blocks surrounded by ```
  const parts = content.split(/(```(?:.*?)\n[\s\S]*?```)/g);
  
  if (parts.length === 1) {
    return content;
  }
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Extract code and language
          const match = part.match(/```(.*?)\n([\s\S]*?)```/);
          if (match) {
            const language = match[1].trim();
            const code = match[2];
            
            return (
              <pre key={i} className="my-2 p-4 rounded-md bg-muted/70 dark:bg-muted/30 overflow-x-auto">
                {language && <div className="text-xs text-muted-foreground mb-2">{language}</div>}
                <code>{code}</code>
              </pre>
            );
          }
          return part;
        }
        return part;
      })}
    </>
  );
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 p-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-2 rounded-lg p-4",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border">
            {isUser ? (
              <User className="h-5 w-5" />
            ) : (
              <Bot className="h-5 w-5" />
            )}
          </div>
          <div className="font-semibold">
            {isUser ? "You" : "AI Assistant"}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <div className="whitespace-pre-wrap text-sm">
          {formatMessageContent(message.content)}
        </div>
      </div>
    </div>
  );
}
