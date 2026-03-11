import { Message } from "@/types/chat";

const FALLBACK_RESPONSES = [
  "I'm currently unable to connect to the AI service. Please ensure Lovable Cloud is enabled for full AI capabilities.",
  "It seems the AI backend isn't configured yet. The interface is ready — just needs the backend connection!",
  "I'd love to help, but the AI service isn't reachable right now. Try again in a moment.",
];

export async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Pick<Message, "role" | "content">[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  if (!supabaseUrl) {
    // Fallback: simulate a response when no backend
    const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    for (const char of fallback) {
      onDelta(char);
      await new Promise((r) => setTimeout(r, 15));
    }
    onDone();
    return;
  }

  try {
    const resp = await fetch(`${supabaseUrl}/functions/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: messages.map((m) => ({ role: m.role, content: m.content })) }),
    });

    if (!resp.ok) {
      if (resp.status === 429) { onError("Rate limited — please wait a moment."); return; }
      if (resp.status === 402) { onError("Usage limit reached. Please add credits."); return; }
      onError("Something went wrong. Please try again.");
      return;
    }

    if (!resp.body) { onError("No response body"); return; }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { onDone(); return; }
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    onDone();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Network error");
  }
}
