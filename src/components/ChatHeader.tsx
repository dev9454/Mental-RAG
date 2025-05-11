
import React from "react";
import { MessageCircle, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Toggle } from "@/components/ui/toggle";

interface ChatHeaderProps {
  title: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center justify-between p-4 border-b bg-card text-card-foreground shadow-sm sticky top-0 z-10">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-chatbot-primary text-white mr-3">
          <MessageCircle size={18} />
        </div>
        <div>
          <h1 className="text-lg font-medium">{title}</h1>
          <p className="text-xs text-muted-foreground flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
            Online
          </p>
        </div>
      </div>
      
      <Toggle 
        aria-label="Toggle theme"
        className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
        pressed={theme === "dark"}
        onPressedChange={toggleTheme}
      >
        {theme === "dark" ? (
          <Sun size={16} className="text-yellow-400" />
        ) : (
          <Moon size={16} />
        )}
      </Toggle>
    </div>
  );
};

export default ChatHeader;
