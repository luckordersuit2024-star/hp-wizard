import Wizard from "@/components/Wizard";

export default function Home() {
  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <header className="flex items-center gap-3 px-6 py-3.5 border-b border-zinc-200 bg-white shrink-0">
        <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="font-bold text-zinc-900 text-sm tracking-tight">HP Wizard</span>
        <span className="text-xs text-zinc-400 border border-zinc-200 rounded-full px-2 py-0.5 ml-1">beta</span>
      </header>
      <div className="flex-1 overflow-hidden">
        <Wizard />
      </div>
    </main>
  );
}
