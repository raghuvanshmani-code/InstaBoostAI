

'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Hash, MessageSquareQuote, Sparkles, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CopyButton } from './copy-button';
import { HashtagReasoning, type HashtagReasoningData } from './hashtag-reasoning';


export type AIResults = {
  description: string;
  captions: string[];
  hashtags: { tag: string; reach: number }[];
  hashtagReasoning: HashtagReasoningData;
};

type ResultsPanelProps = {
  results: AIResults | null;
  isLoading: boolean;
  imagePreview: string | null;
};

const ShimmerSkeleton = () => (
  <div className="relative w-full h-full overflow-hidden rounded-lg bg-muted">
    <div className="shimmer-gradient absolute inset-0" />
  </div>
);

const LoadingIndicator = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full aspect-square rounded-lg shadow-lg bg-card border flex flex-col items-center justify-center p-8 gap-6">
      <div className="flex items-center gap-4">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        <h2 className="text-2xl font-semibold text-foreground">
          Generating Ideas...
        </h2>
      </div>
      <p className="text-muted-foreground text-center">
        Our AI is crafting the perfect content for your image. This might take a few moments.
      </p>
      <div className="w-full max-w-md mt-4">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-center text-muted-foreground mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};


export default function ResultsPanel({ results, isLoading, imagePreview }: ResultsPanelProps) {
  if (isLoading || !results) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto items-start">
        <div className="w-full aspect-square rounded-lg overflow-hidden relative shadow-lg">
          {imagePreview ? (
             <Image src={imagePreview} alt="Content preview" fill className="object-cover" />
          ) : (
            <ShimmerSkeleton />
          )}
        </div>
        <div className="w-full">
            <LoadingIndicator />
        </div>
      </div>
    );
  }

  const allHashtags = results.hashtags.map(h => h.tag).join(' ');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto items-start">
        <div className="md:sticky md:top-24 w-full">
          <div className="w-full aspect-square rounded-lg overflow-hidden relative shadow-lg">
            {imagePreview && (
               <Image src={imagePreview} alt="Content preview" fill className="object-cover" />
            )}
          </div>
        </div>
        <div className="h-full w-full">
          <Tabs defaultValue="captions" className="flex flex-col h-full w-full">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="captions" className="text-base gap-2">
                <MessageSquareQuote />
                Captions
              </TabsTrigger>
              <TabsTrigger value="hashtags" className="text-base gap-2">
                <Hash />
                Hashtags
              </TabsTrigger>
              <TabsTrigger value="description" className="text-base gap-2">
                <FileText />
                Description
              </TabsTrigger>
            </TabsList>
            <div className="flex-grow mt-4 overflow-hidden">
                <TabsContent value="captions" className="h-full m-0">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle>Generated Captions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden">
                      <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                          {results.captions.map((caption, index) => (
                            <div key={index} className="flex justify-between items-start gap-4 p-4 rounded-lg bg-background border">
                              <p className="text-sm flex-grow pt-1">{caption}</p>
                              <CopyButton textToCopy={caption} />
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="hashtags" className="h-full m-0">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Suggested Hashtags</CardTitle>
                        <CopyButton textToCopy={allHashtags} />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden">
                        <ScrollArea className="h-full pr-4">
                            <div className="flex flex-wrap gap-3 mb-6">
                                {results.hashtags.map((hashtag, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-sm font-medium px-4 py-2 flex items-center gap-2"
                                >
                                    <span>{hashtag.tag}</span>
                                    <span className="flex items-center gap-1 text-primary font-bold">
                                        <TrendingUp className="h-4 w-4" />
                                        {hashtag.reach}%
                                    </span>
                                </Badge>
                                ))}
                            </div>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="reasoning">
                                <AccordionTrigger>Why these hashtags?</AccordionTrigger>
                                <AccordionContent>
                                    <HashtagReasoning reasoning={results.hashtagReasoning} />
                                </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="description" className="h-full m-0">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>Image Analysis</CardTitle>
                        <CopyButton textToCopy={results.description} />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden">
                        <ScrollArea className="h-full pr-4">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{results.description}</p>
                        </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
            </div>
          </Tabs>
        </div>
    </div>
  );
}
