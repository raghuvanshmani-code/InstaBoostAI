import InstaBoostClient from '@/app/components/instaboost-client';
import { Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-svh bg-background font-sans">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/80 px-4 shrink-0 backdrop-blur-sm sm:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Bot size={20} />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          InstaBoost AI
        </h1>
      </header>
      <main className="flex-1">
        <InstaBoostClient />
      </main>
    </div>
  );
}
