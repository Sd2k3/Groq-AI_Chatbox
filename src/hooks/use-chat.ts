
import { useState, useCallback, useEffect } from 'react';
import { Message, ChatStore } from '@/types/chat';
import { generateChatResponse } from '@/utils/groq-api';

// Get a unique ID for messages
const getUniqueId = () => `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Set up event for API key updates
export const triggerApiKeyUpdate = () => {
  console.log("API key updated, triggering event");
  window.dispatchEvent(new Event('groq-api-key-updated'));
};

export const useChat = () => {
  // Get messages from local storage or initialize empty array
  const [state, setState] = useState<ChatStore>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return {
      messages: savedMessages ? JSON.parse(savedMessages) : [],
      isLoading: false,
      error: null,
    };
  });

  // Save messages to local storage when they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(state.messages));
  }, [state.messages]);

  // Check for API key
  const checkApiKey = useCallback(() => {
    const storedApiKey = localStorage.getItem('groq-api-key');
    if (storedApiKey) {
      console.log("Valid API key found in localStorage");
      // Make API key available globally
      (window as any).GROQ_API_KEY = storedApiKey;
      return true;
    }
    console.log("No API key found in localStorage");
    return false;
  }, []);

  // Initialize on mount and when API key updates
  useEffect(() => {
    checkApiKey();
    
    // Listen for API key updates
    const handleApiKeyUpdate = () => {
      console.log("API key update event received");
      checkApiKey();
    };
    
    window.addEventListener('groq-api-key-updated', handleApiKeyUpdate);
    
    return () => {
      window.removeEventListener('groq-api-key-updated', handleApiKeyUpdate);
    };
  }, [checkApiKey]);

  // Send message to API and get response
  const sendMessage = useCallback(async (content: string) => {
    try {
      // Check for API key first
      if (!checkApiKey()) {
        setState(prev => ({
          ...prev,
          error: "API key not found. Please add your GROQ API key.",
        }));
        setTimeout(() => {
          setState(prev => ({ ...prev, error: null }));
        }, 5000);
        return;
      }

      // Add user message to state
      const userMessage: Message = {
        id: getUniqueId(),
        content,
        role: 'user',
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        // Convert messages to format expected by API
        const apiMessages = state.messages.concat(userMessage).map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

        // Add system message if none exists
        if (!apiMessages.some(msg => msg.role === 'system')) {
          apiMessages.unshift({
            role: 'system',
            content: 'You are a helpful, friendly AI assistant. You remember the conversation history and provide relevant, thoughtful responses.',
          });
        }

        // Get response from API
        const response = await generateChatResponse(apiMessages);

        // Add assistant message to state
        const assistantMessage: Message = {
          id: getUniqueId(),
          content: response.content,
          role: 'assistant',
          timestamp: Date.now(),
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error sending message:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        }));
        
        // Clear error after 5 seconds
        setTimeout(() => {
          setState(prev => ({ ...prev, error: null }));
        }, 5000);
      }
    } catch (outerError) {
      console.error('Unexpected error:', outerError);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: outerError instanceof Error ? outerError.message : 'An unexpected error occurred',
      }));
    }
  }, [state.messages, checkApiKey]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
    localStorage.removeItem('chatMessages');
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearMessages,
  };
};
