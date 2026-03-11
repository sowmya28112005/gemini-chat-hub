const BreathingLoader = () => (
  <div className="flex items-center gap-1 py-2 px-1">
    <div
      className="w-5 h-5 rounded-full animate-breathe"
      style={{
        background: "radial-gradient(circle, hsl(0 0% 29%) 0%, transparent 70%)",
      }}
    />
    <span className="text-xs text-muted-foreground font-sans ml-1">Thinking…</span>
  </div>
);

export default BreathingLoader;
