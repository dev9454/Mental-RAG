
import React from "react";
import { MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  return (
    <motion.div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={cn(
          "flex items-center justify-center rounded-full p-2 h-9 w-9",
          isUser 
            ? "bg-chatbot-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}>
          {isUser ? <User size={16} /> : <MessageCircle size={16} />}
        </div>
        <div 
          className={cn(
            "chatbot-message p-3 rounded-2xl",
            isUser 
              ? "chatbot-message-user bg-chatbot-primary text-primary-foreground rounded-tr-sm" 
              : "chatbot-message-bot bg-card border border-border text-card-foreground rounded-tl-sm"
          )}
        >
          {message}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
