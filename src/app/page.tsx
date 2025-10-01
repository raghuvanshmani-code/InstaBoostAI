
'use client';

import { useState, useTransition } from 'react';
import { Bot, BrainCircuit, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import ContentPanel from '@/app/components/content-panel';
import ResultsPanel from '@/app/components/results-panel';
import type { AIResults } from '@/app/components/results-panel';
import { generateAllSuggestions } from './actions';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AnalyticsCharts from './components/analytics-charts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/app/components/copy-button';

const toDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const strategyData = [
    {
        icon: BrainCircuit,
        title: 'Deep Content Analysis',
        description: 'Our AI analyzes image context, objects, and sentiment to craft a narrative that resonates.',
    },
    {
        icon: TrendingUp,
        title: 'Trend-Aware Hashtags',
        description: 'We recommend hashtags that can connect you with engaged communities.',
    },
    {
        icon: Sparkles,
        title: 'Creative Captioning',
        description: 'Generate a variety of creative captions in different tones to spark conversation.',
    },
];

const testimonials = [
    {
        name: 'Jessica L.',
        role: 'Social Media Manager',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        comment: "InstaBoost AI has been a game-changer for my workflow. The hashtag suggestions are incredibly insightful and have doubled our engagement.",
    },
    {
        name: 'Mike R.',
        role: 'Food Blogger',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
        comment: "I used to spend hours brainstorming captions. Now, I get five amazing options in seconds. It's like having a creative partner on demand!",
    },
    {
        name: 'Chloe T.',
        role: 'Travel Influencer',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
        comment: 'The quality of the content analysis is stunning. It picks up on nuances in my photos that I would have missed, leading to much richer descriptions.',
    },
];

const sampleOutput = {
  captions: [
    "Lost in a golden hour dream. ✨ This glitter liner is my new favorite way to shine.",
    "A moment of peace in a world of chaos. Sometimes, you just need to close your eyes and find your light. 🌿",
    "Makeup is my art, and the world is my canvas. What's your favorite way to express yourself?",
  ],
  hashtags: [
    { tag: '#GoldenHourMagic', reach: 92 },
    { tag: '#CreativeMakeup', reach: 88 },
    { tag: '#EtherealBeauty', reach: 85 },
    { tag: '#GlitterLiner', reach: 80 },
    { tag: '#PortraitPerfection', reach: 78 },
  ]
};


export default function Home() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<AIResults | null>(null);
  const [tone, setTone] = useState('casual');
  const [language, setLanguage] = useState('english');
  const [customInstructions, setCustomInstructions] = useState('');

  const sampleImages = PlaceHolderImages.filter(p => p.id.startsWith('sample-'));
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image-1');

  const handleFileChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      setResults(null);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };
  
  const handleGenerateClick = () => {
    if (imageFile) {
      handleGenerate(imageFile);
    } else {
      toast({
        title: 'No Image Selected',
        description: 'Please select an image before generating content.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerate = async (fileOrUrl: File | string) => {
    setResults(null);
    startTransition(async () => {
      let imageUri: string | undefined = undefined;

      if (typeof fileOrUrl === 'string') {
        // It's a URL from a sample image
        imageUri = fileOrUrl;
      } else {
        // It's a file from user upload
        try {
          imageUri = await toDataURL(fileOrUrl);
        } catch (error) {
          toast({
            title: 'Image Processing Error',
            description: 'Could not read the image file. Please try another image.',
            variant: 'destructive',
          });
          return;
        }
      }

      const response = await generateAllSuggestions({
        imageUri,
        tone,
        language,
        customInstructions,
      });

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
    // Set preview immediately
    setImagePreview(imageUrl);
    setResults(null); // Clear previous results
    
    // Set a placeholder File object, since some logic depends on it.
    // The actual generation will use the URL.
    const sampleFile = new File([], "sample.jpg", {type: "image/jpeg"});
    setImageFile(sampleFile);

    // Directly trigger generation with the image URL
    handleGenerate(imageUrl);
  };


  const showResults = imagePreview && (results || isPending);

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
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center p-4">
        {showResults ? (
          <ResultsPanel results={results} isLoading={isPending} imagePreview={imagePreview} />
        ) : (
          <>
            <div className="container mx-auto p-4 py-8 md:py-12">
               <div className="text-center mb-10">
                  <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                    Unlock Your Social Media Potential
                  </h1>
                  <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
                    From a single image, get viral captions, strategic hashtags, and engaging post ideas in seconds.
                  </p>
                </div>

              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl">
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
                </div>
                <div className="flex flex-col gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Example Captions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {sampleOutput.captions.map((caption, i) => (
                           <div key={i} className="flex justify-between items-start gap-2 p-3 rounded-lg bg-background border text-sm">
                              <p className="flex-grow">{caption}</p>
                              <CopyButton textToCopy={caption} size="sm" />
                            </div>
                        ))}
                      </CardContent>
                    </Card>
                     <Card>
                      <CardHeader>
                        <CardTitle>Example Hashtags</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {sampleOutput.hashtags.map((h, i) => (
                          <Badge key={i} variant="secondary" className="text-sm">{h.tag}</Badge>
                        ))}
                      </CardContent>
                    </Card>
                    <Button 
                      size="lg"
                      onClick={() => document.getElementById('content-panel')?.scrollIntoView({ behavior: 'smooth' })}
                      className="mt-4 w-full md:w-auto self-center"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Your Own
                    </Button>
                </div>
              </div>
            </div>

            <div id="content-panel" className="w-full max-w-6xl mx-auto py-12 md:py-24">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
                     <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Create Your Post</h2>
                      <p className="mt-4 text-lg text-muted-foreground md:text-left">
                       1. Upload an image. <br/>
                       2. Customize the tone. <br/>
                       3. Generate content!
                     </p>
                  </div>
                  <div className="md:col-span-2">
                    <ContentPanel
                      onFileChange={handleFileChange}
                      isLoading={isPending}
                      onSampleClick={handleSampleImageClick}
                      sampleImages={sampleImages}
                      tone={tone}
                      onToneChange={setTone}
                      language={language}
                      onLanguageChange={setLanguage}
                      customInstructions={customInstructions}
                      onCustomInstructionsChange={setCustomInstructions}
                      onGenerateClick={handleGenerateClick}
                      imageSelected={!!imagePreview}
                      imagePreview={imagePreview}
                    />
                  </div>
              </div>
            </div>
            
            <section className="w-full bg-background py-12 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Strategy Behind the Magic</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">We combine deep analysis with creative prompting to give your content an edge.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {strategyData.map((item, index) => (
                            <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    <item.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="w-full bg-background py-12 md:py-24">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Data-Driven Results You Can See
                  </h2>
                  <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Our AI analyzes performance data to recommend content strategies that work.
                  </p>
                </div>
                <AnalyticsCharts />
              </div>
            </section>

            <section className="w-full bg-background py-12 md:py-24">
                <div className="container mx-auto px-4">
                     <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by Creators Worldwide</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Don't just take our word for it. Here's what our users are saying.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="bg-card shadow-lg">
                                <CardContent className="pt-6">
                                    <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                                    <div className="flex items-center gap-4 mt-6">
                                        <Avatar>
                                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
          </>
        )}
      </main>
      <footer className="w-full border-t bg-background">
          <div className="container mx-auto flex h-16 items-center justify-center p-4">
              <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} InstaBoost AI. All Rights Reserved.</p>
          </div>
      </footer>
    </div>
  );
}
