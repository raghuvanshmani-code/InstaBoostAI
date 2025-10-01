import { Bot } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import InstaBoostClient from '@/app/components/instaboost-client';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-image-1');

  return (
    <div className="flex flex-col min-h-svh bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-7 w-7 text-primary" />
            <span className="text-xl font-semibold tracking-tight">
              InstaBoost AI
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="#">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="#">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto p-4 py-8 md:py-12">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="flex flex-col items-start gap-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                AI-Powered Social Content
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Generate stunning captions and hashtags for your Instagram
                posts in seconds.
              </p>
              <div className="relative mt-4 w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                {heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white">
                    Effortless Content Creation
                  </h3>
                  <p className="mt-2 text-lg text-white/90">
                    Upload your image and let our AI do the heavy lifting.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <InstaBoostClient />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
