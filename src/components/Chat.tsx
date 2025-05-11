
import React, { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { ChatService, ChatMessage as ChatMessageType } from "@/services/ChatService";
import { motion } from "framer-motion";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "welcome",
      content: "Hi, I'm here to support you. How are you feeling today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Send message to chatbot
      const botResponse = await ChatService.sendMessage(content);
      
      // Add bot response to chat
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content: "Sorry, I'm having trouble connecting. Please try again.",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      className="flex flex-col h-full rounded-lg shadow-xl overflow-hidden bg-background"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ChatHeader title="Mental Health Assistant" />
      
      <ChatContainer>
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            message={message.content}
            isUser={message.isUser}
          />
        ))}
        {isTyping && <TypingIndicator />}
      </ChatContainer>
      
      <ChatInput onSend={handleSendMessage} disabled={isTyping} />
    </motion.div>
  );
};

export default Chat;
