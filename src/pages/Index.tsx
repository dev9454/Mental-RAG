
import React from "react";
import Chat from "@/components/Chat";

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-0 bg-gradient-to-b from-background to-background/80 dark:from-background/50 dark:to-background">
      <div className="flex-1 max-w-md w-full mx-auto my-0 sm:my-4">
        <Chat />
      </div>
    </div>
  );
};

export default Index;
