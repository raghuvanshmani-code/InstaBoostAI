'use client';

import { useState, useTransition } from 'react';
import ContentPanel from './content-panel';
import ResultsPanel from './results-panel';
import { generateAllSuggestions } from '../actions';
import type { AIResults } from './results-panel';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const toDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function InstaBoostClient() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const placeholderImage = PlaceHolderImages.find(img => img.id === 'uploader-placeholder');
  const [imagePreview, setImagePreview] = useState<string | null>(placeholderImage?.imageUrl || null);
  const [contentDescription, setContentDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [results, setResults] = useState<AIResults | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(placeholderImage?.imageUrl || null);
    }
  };

  const handleGenerate = async () => {
    if (!contentDescription && !imageFile) {
      toast({
        title: 'Input Missing',
        description: 'Please provide an image or a description for your content.',
        variant: 'destructive',
      });
      return;
    }

    setResults(null);

    startTransition(async () => {
      let imageUri: string | undefined = undefined;
      if (imageFile) {
        try {
          imageUri = await toDataURL(imageFile);
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
        contentDescription: contentDescription || 'An image provided by the user',
        imageUri,
      });

      if (response.error) {
        toast({
          title: 'Generation Failed',
          description: response.error,
          variant: 'destructive',
        });
      } else if (response.data) {
        setResults(response.data);
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-screen-2xl p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <ContentPanel
          imagePreview={imagePreview}
          onFileChange={handleFileChange}
          contentDescription={contentDescription}
          setContentDescription={setContentDescription}
          location={location}
          setLocation={setLocation}
          tags={tags}
          setTags={setTags}
          onGenerate={handleGenerate}
          isLoading={isPending}
        />
        <ResultsPanel results={results} isLoading={isPending} />
      </div>
    </div>
  );
}
