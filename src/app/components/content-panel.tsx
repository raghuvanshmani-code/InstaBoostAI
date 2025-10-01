'use client';

import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Loader2, Upload, FileUp } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ContentPanelProps = {
  imagePreview: string | null;
  onFileChange: (file: File | null) => void;
  onGenerate: () => void;
  isLoading: boolean;
};

export default function ContentPanel({
  imagePreview,
  onFileChange,
  onGenerate,
  isLoading,
}: ContentPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const placeholderImage = PlaceHolderImages.find(p => p.id === 'uploader-placeholder');

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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="text-primary" />
          Content
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div
          className={cn(
            'relative group flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors',
            isDragging ? 'border-primary bg-primary/10' : 'hover:border-primary/50'
          )}
          onClick={handleFileSelect}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <>
              <Image
                src={imagePreview}
                alt="Content preview"
                fill
                className="object-contain rounded-md transition-opacity group-hover:opacity-20"
                data-ai-hint={placeholderImage?.imageHint}
              />
              <div className="flex flex-col items-center gap-2 text-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <FileUp className="h-10 w-10" />
                <p className="font-semibold text-lg">Change Image</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
              <Upload className="h-12 w-12" />
              <div>
                <p className="font-semibold text-lg">Click to upload or drag and drop</p>
                <p className="text-sm">SVG, PNG, JPG or GIF</p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            id="content-upload"
            className="hidden"
            accept="image/*,video/*"
            onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <Button onClick={onGenerate} disabled={isLoading} size="lg" className="w-full">
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Generate Suggestions'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
