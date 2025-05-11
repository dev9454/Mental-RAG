
import React from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const TypingIndicator: React.FC = () => {
  return (
    <motion.div 
      className="flex mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-3 max-w-[85%] md:max-w-[70%]">
        <div className="bg-muted text-muted-foreground flex items-center justify-center rounded-full p-2 h-9 w-9">
          <MessageCircle size={16} />
        </div>
        <div className="typing-indicator bg-card border border-border rounded-2xl p-3.5">
          <div className="flex space-x-2">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
