import { useState, useCallback, useRef, useEffect } from "react";
import { Conversation, Message } from "@/types/chat";
import { loadConversations, saveConversations, generateId, generateTitle } from "@/lib/storage";
import { streamChat } from "@/lib/ai";

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(() => loadConversations());
  const [activeId, setActiveId] = useState<string | null>(() => {
    const convos = loadConversations();
    return convos.length > 0 ? convos[0].id : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(false);

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const createConversation = useCallback(() => {
    const newConvo: Conversation = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConvo, ...prev]);
    setActiveId(newConvo.id);
    return newConvo.id;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveId((curr) => (curr === id ? null : curr));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    let convoId = activeId;
    if (!convoId) {
      const newConvo: Conversation = {
        id: generateId(),
        title: generateTitle(content),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations((prev) => [newConvo, ...prev]);
      convoId = newConvo.id;
      setActiveId(convoId);
    }

    const userMsg: Message = { id: generateId(), role: "user", content, timestamp: Date.now() };
    const assistantMsg: Message = { id: generateId(), role: "assistant", content: "", timestamp: Date.now() };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convoId) return c;
        const isNew = c.messages.length === 0;
        return {
          ...c,
          title: isNew ? generateTitle(content) : c.title,
          messages: [...c.messages, userMsg, assistantMsg],
          updatedAt: Date.now(),
        };
      })
    );

    setIsLoading(true);
    abortRef.current = false;

    const allMessages = [
      ...(conversations.find((c) => c.id === convoId)?.messages ?? []),
      userMsg,
    ];

    await streamChat({
      messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
      onDelta: (text) => {
        if (abortRef.current) return;
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== convoId) return c;
            const msgs = [...c.messages];
            const last = msgs[msgs.length - 1];
            if (last?.role === "assistant") {
              msgs[msgs.length - 1] = { ...last, content: last.content + text };
            }
            return { ...c, messages: msgs, updatedAt: Date.now() };
          })
        );
      },
      onDone: () => setIsLoading(false),
      onError: (err) => {
        setIsLoading(false);
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== convoId) return c;
            const msgs = [...c.messages];
            const last = msgs[msgs.length - 1];
            if (last?.role === "assistant") {
              msgs[msgs.length - 1] = { ...last, content: `Error: ${err}` };
            }
            return { ...c, messages: msgs };
          })
        );
      },
    });
  }, [activeId, conversations]);

  return {
    conversations,
    activeConversation,
    activeId,
    isLoading,
    setActiveId,
    createConversation,
    deleteConversation,
    sendMessage,
  };
}
