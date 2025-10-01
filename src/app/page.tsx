
'use client';

import { useState, useTransition } from 'react';
import { Bot } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ContentPanel from '@/app/components/content-panel';
import ResultsPanel from '@/app/components/results-panel';
import type { AIResults } from '@/app/components/results-panel';
import { generateAllSuggestions } from './actions';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const toDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<AIResults | null>(null);

  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-image-1');
  const sampleImages = PlaceHolderImages.filter(p => p.id.startsWith('sample-'));

  const handleFileChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      setResults(null);
      handleGenerate(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleGenerate = async (file: File) => {
    setResults(null);
    startTransition(async () => {
      let imageUri: string | undefined = undefined;
      try {
        imageUri = await toDataURL(file);
      } catch (error) {
        toast({
          title: 'Image Processing Error',
          description: 'Could not read the image file. Please try another image.',
          variant: 'destructive',
        });
        return;
      }

      const response = await generateAllSuggestions({ imageUri });
      if (response.error) {
        toast({
          title: 'Generation Failed',
          description: response.error,
          variant: 'destructive',
        });
        setResults(null);
      } else if (response.data) {
        setResults(response.data);
      }
    });
  };

  const handleSampleImageClick = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "sample-image.jpg", { type: blob.type });
      handleFileChange(file);
    } catch (error) {
      toast({
        title: "Failed to load sample",
        description: "There was an issue loading the sample image.",
        variant: "destructive",
      });
    }
  };

  const showResults = imagePreview && results && !isPending;

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
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {showResults ? (
          <ResultsPanel results={results} isLoading={isPending} imagePreview={imagePreview} />
        ) : (
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
                      priority
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
              <div className="flex items-center justify-center">
                <ContentPanel
                  onFileChange={handleFileChange}
                  isLoading={isPending}
                  onSampleClick={handleSampleImageClick}
                  sampleImages={sampleImages}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
