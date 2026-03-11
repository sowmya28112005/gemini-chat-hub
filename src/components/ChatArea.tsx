import { useRef, useEffect } from "react";
import { Conversation } from "@/types/chat";
import ChatBubble from "./ChatBubble";
import { Sparkles } from "lucide-react";

interface ChatAreaProps {
  conversation: Conversation | null;
  isLoading: boolean;
}

const ChatArea = ({ conversation, isLoading }: ChatAreaProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (isNearBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages]);

  if (!conversation || conversation.messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 animate-message-in">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-sans font-medium text-foreground">
            What's on your mind?
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Start a conversation. Your chat history is saved locally.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-3xl mx-auto">
        {conversation.messages.map((msg, i) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isLoading={isLoading && i === conversation.messages.length - 1}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatArea;
