'use client';

import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type ContentPanelProps = {
  onFileChange: (file: File | null) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onSampleClick: (imageUrl: string) => void;
  sampleImages: ImagePlaceholder[];
};

export default function ContentPanel({
  onFileChange,
  onSampleClick,
  sampleImages
}: ContentPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  };

  return (
    <Card className="w-full shadow-2xl">
      <CardContent className="p-6">
        <div
          className={cn(
            'relative group flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background transition-colors',
            isDragging ? 'border-primary bg-primary/10' : 'hover:border-primary/50'
          )}
          onClick={handleFileSelect}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
            <Upload className="h-12 w-12" />
            <div>
              <p className="font-semibold text-lg text-foreground">Click to upload or drag and drop</p>
              <p className="text-sm">SVG, PNG, JPG or GIF</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            id="content-upload"
            className="hidden"
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <div className="mt-6">
            <p className="text-sm font-medium text-muted-foreground mb-3 text-center">Or try with a sample image:</p>
            <div className="grid grid-cols-3 gap-3">
              {sampleImages.map((sample) => (
                <button
                  key={sample.id}
                  className="relative aspect-square w-full rounded-md overflow-hidden group/sample"
                  onClick={() => onSampleClick(sample.imageUrl)}
                >
                  <Image
                    src={sample.imageUrl}
                    alt={sample.description}
                    fill
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
