// ChatService.ts
let conversationHistory = ''; // Store conversation history in memory

export const ChatService = {
  sendMessage: async (message: string): Promise<ChatMessage> => {
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      conversationHistory = data.conversationHistory; // Update history

      return {
        id: Date.now().toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
        
      };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  conversationHistory?: string;
}