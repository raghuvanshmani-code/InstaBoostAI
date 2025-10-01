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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<AIResults | null>(null);

  const sampleImages = PlaceHolderImages.filter(p => p.id.startsWith('sample-'));

  const handleFileChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      setResults(null);
      handleGenerate(file, preview);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleGenerate = async (file?: File, preview?: string) => {
    const currentFile = file || imageFile;
    if (!currentFile) {
      toast({
        title: 'Input Missing',
        description: 'Please provide an image for your content.',
        variant: 'destructive',
      });
      return;
    }

    if (preview && !imagePreview) {
      setImagePreview(preview);
    }
    
    if (file && !imageFile) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }


    setResults(null);

    startTransition(async () => {
      let imageUri: string | undefined = undefined;
      try {
        imageUri = await toDataURL(currentFile);
      } catch (error) {
        toast({
          title: 'Image Processing Error',
          description: 'Could not read the image file. Please try another image.',
          variant: 'destructive',
        });
        return;
      }

      if (!imageUri) {
        toast({
          title: 'Image Processing Error',
          description: 'Could not process the image. Please try another one.',
          variant: 'destructive',
        });
        return;
      }
      
      const response = await generateAllSuggestions({
        imageUri,
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
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "sample-image.jpg", { type: blob.type });
      handleFileChange(file);
    } catch (error) {
      toast({
        title: "Failed to load sample",
        description: "There was an issue loading the sample image.",
        variant: "destructive",
      });
    }
  };

  const showResults = imagePreview && results && !isPending;

  return (
    <div className="w-full">
      {showResults ? (
        <ResultsPanel results={results} isLoading={isPending} imagePreview={imagePreview} />
      ) : (
         <ContentPanel
          onFileChange={handleFileChange}
          isLoading={isPending}
          onSampleClick={handleSampleImageClick}
          sampleImages={sampleImages}
        />
      )}
    </div>
  );
}
