import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 md:px-8 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
        <div
          className="relative rounded-2xl transition-all duration-300"
          style={{
            background: "hsl(0 0% 13%)",
            boxShadow: focused
              ? "0 0 0 1px rgba(255,255,255,0.15), 0 -4px 20px rgba(255,255,255,0.03)"
              : "0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message…"
            disabled={disabled}
            rows={1}
            className="w-full bg-transparent text-foreground font-serif text-[15px] placeholder:text-muted-foreground resize-none px-5 py-4 pr-14 outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all duration-300 ${
              value.trim() && !disabled
                ? "bg-foreground text-primary-foreground opacity-100 hover:opacity-80"
                : "text-muted-foreground opacity-0 pointer-events-none"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground text-center mt-2 font-sans">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
