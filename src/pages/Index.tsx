import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";

const Index = () => {
  const {
    conversations,
    activeConversation,
    activeId,
    isLoading,
    setActiveId,
    createConversation,
    deleteConversation,
    sendMessage,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onCreate={createConversation}
        onDelete={deleteConversation}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={activeConversation?.title}
        />
        <ChatArea conversation={activeConversation} isLoading={isLoading} />
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Index;
