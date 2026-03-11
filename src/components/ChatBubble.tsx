import ReactMarkdown from "react-markdown";
import { Message } from "@/types/chat";
import BreathingLoader from "./BreathingLoader";

interface ChatBubbleProps {
  message: Message;
  isLoading?: boolean;
}

const ChatBubble = ({ message, isLoading }: ChatBubbleProps) => {
  const isUser = message.role === "user";
  const isEmpty = !message.content && message.role === "assistant";

  return (
    <div
      className={`flex animate-message-in ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-2xl font-serif text-[15px] leading-relaxed transition-all duration-300 ${
          isUser
            ? "bg-chat-user text-foreground rounded-br-md"
            : "rounded-bl-md"
        }`}
        style={
          !isUser
            ? {
                background: "linear-gradient(145deg, rgba(38,38,38,0.6), rgba(30,30,30,0.3))",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
              }
            : undefined
        }
      >
        {isEmpty && isLoading ? (
          <BreathingLoader />
        ) : (
          <div className="prose prose-invert prose-sm max-w-none [&_pre]:bg-secondary [&_pre]:rounded-lg [&_pre]:p-3 [&_code]:font-mono [&_code]:text-foreground [&_p]:mb-2 [&_p:last-child]:mb-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
