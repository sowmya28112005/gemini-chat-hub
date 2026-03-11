import { Menu, Sparkles } from "lucide-react";

interface ChatHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

const ChatHeader = ({ onMenuClick, title }: ChatHeaderProps) => (
  <header className="h-14 flex items-center px-4 border-b border-border bg-background/80 backdrop-blur-sm">
    <button
      onClick={onMenuClick}
      className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
    >
      <Menu className="w-5 h-5" />
    </button>
    <div className="flex items-center gap-2 ml-2 lg:ml-0">
      <Sparkles className="w-4 h-4 text-muted-foreground hidden lg:block" />
      <h1 className="text-sm font-sans font-medium text-foreground truncate">
        {title || "Sowmya Gemini"}
      </h1>
    </div>
  </header>
);

export default ChatHeader;
