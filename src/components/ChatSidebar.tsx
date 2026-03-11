import { Conversation } from "@/types/chat";
import { Plus, MessageSquare, Trash2, X, Sparkles } from "lucide-react";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  open: boolean;
  onClose: () => void;
}

const ChatSidebar = ({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  open,
  onClose,
}: ChatSidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-background/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:relative z-50 top-0 left-0 h-full w-[260px] bg-card flex flex-col border-r border-border transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-foreground" />
            <span className="font-sans font-semibold text-sm text-foreground">Sowmya Gemini</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New chat */}
        <div className="p-3">
          <button
            onClick={onCreate}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-sans text-foreground bg-secondary hover:bg-accent transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {conversations.length === 0 && (
            <p className="text-xs text-muted-foreground text-center mt-8 font-sans">
              No conversations yet
            </p>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => { onSelect(c.id); onClose(); }}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer mb-0.5 transition-colors duration-200 ${
                c.id === activeId
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="text-sm font-sans truncate flex-1">{c.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all duration-200"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
