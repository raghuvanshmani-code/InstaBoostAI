'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
      <div className="flex h-full min-h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-card">
        <div className="text-center text-muted-foreground flex flex-col items-center gap-4">
          <Bot size={48} className="text-primary" />
          <p className="text-lg font-medium">Your AI suggestions will appear here</p>
          <p className="text-sm">Upload your content and hit 'Generate' to start!</p>
        </div>
      </div>
    );
  }

  const allHashtags = results.hashtags.join(' ');

  return (
    <div className="h-full">
      <Tabs defaultValue="captions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="captions">
            <MessageSquareQuote className="mr-2" />
            Captions
          </TabsTrigger>
          <TabsTrigger value="hashtags">
            <Hash className="mr-2" />
            Hashtags
          </TabsTrigger>
          <TabsTrigger value="description">
            <FileText className="mr-2" />
            Description
          </TabsTrigger>
        </TabsList>
        <TabsContent value="captions" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              {results.captions.map((caption, index) => (
                <Card key={index} className="bg-muted/50 hover:bg-muted transition-colors">
                  <CardContent className="p-4 flex justify-between items-start gap-4">
                    <p className="text-sm flex-grow">{caption}</p>
                    <CopyButton textToCopy={caption} />
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hashtags" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Suggested Hashtags</h3>
                <CopyButton textToCopy={allHashtags} />
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {results.hashtags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm font-medium">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem value="reasoning">
                  <AccordionTrigger className="text-sm">Why these hashtags?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {results.hashtagReasoning}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="description" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold flex-grow">Image Analysis</h3>
                <CopyButton textToCopy={results.description} />
              </div>
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
      <Skeleton className="h-10 w-full rounded-lg" />
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-[80%] rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}
