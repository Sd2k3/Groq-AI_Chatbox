
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { triggerApiKeyUpdate } from "@/hooks/use-chat";

export function ApiKeyInput() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key exists in localStorage
    const storedApiKey = localStorage.getItem("groq-api-key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setSaved(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    try {
      // Log for debugging
      console.log("Saving new API key to localStorage");
      
      // Save API key to localStorage
      localStorage.setItem("groq-api-key", apiKey);
      
      // Update the global object to make it available immediately
      (window as any).GROQ_API_KEY = apiKey;
      
      // Trigger event to notify other components about the API key update
      triggerApiKeyUpdate();
      
      setSaved(true);
      toast({
        title: "Success",
        description: "API key saved successfully",
      });
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
          <h4 className="text-sm font-medium">GROQ API Key Required</h4>
        </div>
        <p className="text-xs text-muted-foreground">
          To use the chat functionality, please enter your GROQ API key. You can get one by signing up at{" "}
          <a 
            href="https://console.groq.com/" 
            target="_blank" 
            rel="noreferrer"
            className="text-primary underline"
          >
            console.groq.com
          </a>.
        </p>
        <div className="flex gap-2">
          <Input 
            type="password" 
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setSaved(false);
            }}
            placeholder="Enter your GROQ API key"
            className="flex-1"
          />
          <Button onClick={handleSaveApiKey} disabled={saved && apiKey.length > 0}>
            {saved ? <><Check className="h-4 w-4 mr-1" /> Saved</> : "Save Key"}
          </Button>
        </div>
      </div>
    </div>
  );
}
