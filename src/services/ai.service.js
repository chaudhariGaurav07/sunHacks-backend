export const generateSummary = async (text) => {
  // TODO: Replace with GPT or Ollama
  return "This is a smart AI-generated summary of the document.";
};

export const generateFlashcards = async (text) => {
  return [
    { question: "What is AI?", answer: "AI is artificial intelligence." },
    { question: "What is ML?", answer: "Machine Learning is a subset of AI." },
  ];
};

export const generateMindmap = async (text) => {
  // Mermaid example
  return `graph TD
    A[Main Topic] --> B[Key Point 1]
    A --> C[Key Point 2]
    C --> D[Detail]`;
};

export const generateAudio = async (text) => {
  // For now just mock URL
  return "/audio/generated_audio.mp3";
};
