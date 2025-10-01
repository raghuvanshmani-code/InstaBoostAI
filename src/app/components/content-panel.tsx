'use client';

import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ContentPanelProps = {
  imagePreview: string | null;
  onFileChange: (file: File | null) => void;
  contentDescription: string;
  setContentDescription: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  tags: string;
  setTags: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
};

export default function ContentPanel({
  imagePreview,
  onFileChange,
  contentDescription,
  setContentDescription,
  location,
  setLocation,
  tags,
  setTags,
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
          Your Content
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="content-upload">Upload Image/Video</Label>
          <div
            className={cn(
              'relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors',
              isDragging ? 'border-primary bg-primary/10' : 'hover:border-primary/50 hover:bg-muted'
            )}
            onClick={handleFileSelect}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Content preview"
                fill
                className="object-cover rounded-md"
                data-ai-hint={placeholderImage?.imageHint}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <p className="text-sm">Drag & drop or click to upload</p>
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
        </div>
        <div className="grid gap-2">
          <Label htmlFor="content-description">Content Description</Label>
          <Textarea
            id="content-description"
            placeholder="Describe your content, its theme, and any key elements. The more detail, the better the AI suggestions!"
            value={contentDescription}
            onChange={(e) => setContentDescription(e.target.value)}
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              placeholder="e.g., Paris, France"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Tag People (optional)</Label>
            <Input
              id="tags"
              placeholder="e.g., @username1, @username2"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
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
