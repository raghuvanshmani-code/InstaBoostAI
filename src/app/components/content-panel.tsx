
'use client';

import { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit, CheckCircle, Languages, Upload, WandSparkles } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ContentPanelProps = {
  onFileChange: (file: File | null) => void;
  isLoading: boolean;
  onSampleClick: (imageUrl: string) => void;
  sampleImages: ImagePlaceholder[];
  tone: string;
  onToneChange: (tone: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  customInstructions: string;
  onCustomInstructionsChange: (instructions: string) => void;
  onGenerateClick: () => void;
  imageSelected: boolean;
  imagePreview: string | null;
};

export default function ContentPanel({
  onFileChange,
  isLoading,
  onSampleClick,
  sampleImages,
  tone,
  onToneChange,
  language,
  onLanguageChange,
  customInstructions,
  onCustomInstructionsChange,
  onGenerateClick,
  imageSelected,
  imagePreview,
}: ContentPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  };

  return (
    <Card className="w-full shadow-2xl">
      <CardContent className="p-6 space-y-6">
        <div
          className={cn(
            'relative group flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background transition-colors',
            isDragging ? 'border-primary bg-primary/10' : 'hover:border-primary/50',
            isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          )}
          onClick={handleFileSelect}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="font-semibold text-lg text-foreground">Generating ideas...</p>
                <p className="text-sm text-muted-foreground">Please wait a moment.</p>
            </div>
          ) : imagePreview && imageSelected ? (
             <div className='relative w-full h-full'>
                <Image src={imagePreview} alt="Selected preview" fill className="object-contain rounded-lg" />
                 <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="h-12 w-12 text-white" />
                    <p className="text-white font-semibold mt-2">Image Selected</p>
                    <p className="text-white/80 text-sm">Click to change</p>
                </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
              <Upload className="h-12 w-12" />
              <div>
                <p className="font-semibold text-lg text-foreground">Click to upload or drag and drop</p>
                <p className="text-sm">SVG, PNG, JPG or GIF</p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            id="content-upload"
            className="hidden"
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)}
            disabled={isLoading}
          />
        </div>

        <div>
          <h3 className="text-center text-lg font-semibold mb-4">Customize Your Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone-select" className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" />
                Tone
              </Label>
              <Select value={tone} onValueChange={onToneChange} disabled={isLoading}>
                <SelectTrigger id="tone-select">
                  <SelectValue placeholder="Select a tone..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                  <SelectItem value="witty">Witty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language-select" className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Language
              </Label>
              <Select value={language} onValueChange={onLanguageChange} disabled={isLoading}>
                <SelectTrigger id="language-select">
                  <SelectValue placeholder="Select a language..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="hinglish">Hinglish</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2 md:col-span-2">
              <Label htmlFor="custom-instructions" className="flex items-center gap-2">
                <WandSparkles className="h-4 w-4" />
                Custom Instructions
              </Label>
              <Input 
                id="custom-instructions" 
                placeholder="e.g., 'Mention my new product'"
                value={customInstructions}
                onChange={(e) => onCustomInstructionsChange(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <Button
            onClick={onGenerateClick}
            disabled={isLoading || !imageSelected}
            size="lg"
            className="w-full text-lg"
        >
            <WandSparkles className="mr-2 h-5 w-5" />
            Generate
        </Button>

        <div>
            <p className="text-sm font-medium text-muted-foreground mb-3 text-center">Or try with a sample image:</p>
            <div className="grid grid-cols-3 gap-3">
              {sampleImages.map((sample) => (
                <button
                  key={sample.id}
                  className="relative aspect-square w-full rounded-md overflow-hidden group/sample disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => onSampleClick(sample.imageUrl)}
                  disabled={isLoading}
                >
                  <Image
                    src={sample.imageUrl}
                    alt={sample.description}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform group-hover/sample:scale-105"
                    data-ai-hint={sample.imageHint}
                  />
                   <div className="absolute inset-0 bg-black/20 group-hover/sample:bg-black/40 transition-colors" />
                </button>
              ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
