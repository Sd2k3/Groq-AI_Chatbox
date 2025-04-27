
import { ChatContainer } from "@/components/chat/ChatContainer";
import { KnowledgeManager } from "@/components/knowledge/KnowledgeManager";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto p-2 sm:p-4 pt-4 sm:pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-6">AI Chat with Knowledge Base</h1>
        <p className="text-center text-muted-foreground mb-4 sm:mb-8 text-sm sm:text-base">
          Chat with AI and manage your custom knowledge bases
        </p>
        
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            {mounted && <ChatContainer />}
          </TabsContent>
          
          <TabsContent value="knowledge">
            {mounted && <KnowledgeManager />}
          </TabsContent>
        </Tabs>
      </div>
      <footer className="text-center text-muted-foreground text-xs p-4 mt-8">
        AI Chat with custom knowledge base support
      </footer>
    </div>
  );
}

export default Index;
