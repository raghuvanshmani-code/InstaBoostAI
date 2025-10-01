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
import { FileText, Hash, MessageSquareQuote, Bot } from 'lucide-react';
import { CopyButton } from './copy-button';

export type AIResults = {
  description: string;
  captions: string[];
  hashtags: string[];
  hashtagReasoning: string;
};

type ResultsPanelProps = {
  results: AIResults | null;
  isLoading: boolean;
};

export default function ResultsPanel({ results, isLoading }: ResultsPanelProps) {
  if (isLoading) {
    return <LoadingSkeletons />;
  }

  if (!results) {
    return (
      <Card className="flex h-full min-h-[500px] items-center justify-center bg-card/50">
        <div className="text-center text-muted-foreground flex flex-col items-center gap-4 p-8">
          <Bot size={48} className="text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Your AI suggestions will appear here</h2>
          <p className="text-md max-w-sm">Upload your content and hit 'Generate' to see the magic happen!</p>
        </div>
      </Card>
    );
  }

  const allHashtags = results.hashtags.join(' ');

  return (
    <div className="h-full">
      <Tabs defaultValue="captions" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="captions" className="text-base">
            <MessageSquareQuote className="mr-2" />
            Captions
          </TabsTrigger>
          <TabsTrigger value="hashtags" className="text-base">
            <Hash className="mr-2" />
            Hashtags
          </TabsTrigger>
          <TabsTrigger value="description" className="text-base">
            <FileText className="mr-2" />
            Description
          </TabsTrigger>
        </TabsList>
        <TabsContent value="captions" className="mt-4">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Generated Captions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.captions.map((caption, index) => (
                <div key={index} className="flex justify-between items-start gap-4 p-4 rounded-lg bg-background/50 border">
                  <p className="text-sm flex-grow pt-1">{caption}</p>
                  <CopyButton textToCopy={caption} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hashtags" className="mt-4">
          <Card className="bg-card/50">
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
          <Card className="bg-card/50">
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
  );
}

function LoadingSkeletons() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full rounded-lg" />
      <Card className="bg-card/50">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-[80%] rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}
