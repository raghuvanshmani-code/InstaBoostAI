import InstaBoostClient from '@/app/components/instaboost-client';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-svh bg-background font-body">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles size={20} />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground font-headline">
          InstaBoost AI
        </h1>
      </header>
      <main className="flex-1">
        <InstaBoostClient />
      </main>
    </div>
  );
}
