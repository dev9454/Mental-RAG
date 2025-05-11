
import React, { useEffect, useRef } from "react";

interface ChatContainerProps {
  children: React.ReactNode;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ children }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [children]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {children}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
