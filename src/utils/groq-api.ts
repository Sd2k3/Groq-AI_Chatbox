
// Use fetch API directly instead of groq client
const getApiKey = () => {
  // Check for environment variable first
  const envApiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (envApiKey) return envApiKey;
  
  // Then check localStorage
  const storedApiKey = localStorage.getItem('groq-api-key');
  if (storedApiKey) return storedApiKey;
  
  // Finally use the hardcoded key (only as last resort)
  return "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";
};

export const generateChatResponse = async (messages: { role: string; content: string }[]) => {
  try {
    // Get API key directly before each request to ensure we have the latest
    const currentApiKey = getApiKey();
    
    // Debug log to check what key is being used
    console.log("Using API key:", currentApiKey ? "Valid key exists" : "No valid key found");
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${currentApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GROQ API error details:", errorData);
      throw new Error(`GROQ API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
};
