'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Hash, MessageSquareQuote } from 'lucide-react';
import { CopyButton } from './copy-button';
import Image from 'next/image';

export type AIResults = {
  description: string;
  captions: string[];
  hashtags: string[];
  hashtagReasoning: string;
};

type ResultsPanelProps = {
  results: AIResults | null;
  isLoading: boolean;
  imagePreview: string | null;
};

export default function ResultsPanel({ results, isLoading, imagePreview }: ResultsPanelProps) {
  if (isLoading || !results) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="w-full aspect-video rounded-lg overflow-hidden relative shadow-lg">
          {imagePreview ? (
             <Image src={imagePreview} alt="Content preview" fill className="object-cover" />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>
        <div className="space-y-4 w-full">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Card className="bg-card/50">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-[80%] rounded-lg" />
              </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  const allHashtags = results.hashtags.join(' ');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="w-full aspect-video rounded-lg overflow-hidden relative shadow-lg">
          {imagePreview && (
             <Image src={imagePreview} alt="Content preview" fill className="object-cover" />
          )}
        </div>
        <div className="h-full w-full">
          <Tabs defaultValue="captions" className="w-full">
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
            <TabsContent value="captions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Captions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.captions.map((caption, index) => (
                    <div key={index} className="flex justify-between items-start gap-4 p-4 rounded-lg bg-background border">
                      <p className="text-sm flex-grow pt-1">{caption}</p>
                      <CopyButton textToCopy={caption} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="hashtags" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Suggested Hashtags</CardTitle>
                    <CopyButton textToCopy={allHashtags} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {results.hashtags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm font-medium px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="reasoning">
                      <AccordionTrigger>Why these hashtags?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {results.hashtagReasoning}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="description" className="mt-4">
              <Card>
                 <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Image Analysis</CardTitle>
                    <CopyButton textToCopy={results.description} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{results.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    </div>
  );
}
