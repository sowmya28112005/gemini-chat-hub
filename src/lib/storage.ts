import { Conversation } from "@/types/chat";

const STORAGE_KEY = "sowmya-gemini-chats";

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim().slice(0, 40);
  return trimmed.length < firstMessage.trim().length ? trimmed + "…" : trimmed;
}
