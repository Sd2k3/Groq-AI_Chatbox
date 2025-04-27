
import { useRef, useEffect, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { ApiKeyInput } from "./ApiKeyInput";

export function ChatContainer() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check if API key exists
  useEffect(() => {
    const checkApiKey = () => {
      const storedApiKey = localStorage.getItem("groq-api-key");
      setHasApiKey(!!storedApiKey);
    };

    checkApiKey();
    
    // Listen for storage changes (in case API key is set in another tab)
    window.addEventListener("storage", checkApiKey);
    
    // Create a custom event listener for API key updates within the same tab
    window.addEventListener("groq-api-key-updated", checkApiKey);
    
    return () => {
      window.removeEventListener("storage", checkApiKey);
      window.removeEventListener("groq-api-key-updated", checkApiKey);
    };
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Show welcome message if no messages
  const showWelcomeMessage = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col rounded-lg border bg-background shadow">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-xl font-semibold">GROQ AI Chat</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={clearMessages}
            disabled={messages.length === 0 || isLoading}
            title="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear chat</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* API Key Input */}
      {!hasApiKey && (
        <div className="p-4 border-b">
          <ApiKeyInput />
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {showWelcomeMessage ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="rounded-lg bg-muted p-8 text-center max-w-xl">
              <h3 className="mb-2 text-2xl font-bold">Welcome to GROQ AI Chat!</h3>
              <p className="mb-4 text-muted-foreground">
                Powered by Llama 3 70B, this AI assistant remembers your entire conversation history.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="rounded-md border p-3">
                  <h4 className="font-medium">Ask a question</h4>
                  <p className="text-sm text-muted-foreground">Get detailed information on any topic</p>
                </div>
                <div className="rounded-md border p-3">
                  <h4 className="font-medium">Creative writing</h4>
                  <p className="text-sm text-muted-foreground">Generate stories, poems or creative ideas</p>
                </div>
                <div className="rounded-md border p-3">
                  <h4 className="font-medium">Code help</h4>
                  <p className="text-sm text-muted-foreground">Get help with programming problems</p>
                </div>
                <div className="rounded-md border p-3">
                  <h4 className="font-medium">Conversation</h4>
                  <p className="text-sm text-muted-foreground">Chat naturally with an AI that remembers context</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {/* Show error message */}
        {error && (
          <div className="my-4 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            <p>Error: {error}</p>
            <p className="mt-2 text-sm">Please try again later.</p>
          </div>
        )}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>AI is thinking...</span>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4">
        <ChatInput onSend={sendMessage} isLoading={isLoading} disabled={!hasApiKey} />
      </div>
    </div>
  );
}
