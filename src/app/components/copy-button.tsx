
'use client';

import { useState, useEffect } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type CopyButtonProps = {
  textToCopy: string;
  className?: string;
  size?: ButtonProps['size'];
}

export function CopyButton({ textToCopy, className, size = "icon" }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <TooltipProvider>
      <Tooltip open={isCopied}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            onClick={handleCopy}
            className={cn('text-muted-foreground hover:text-foreground', 
              size === 'icon' && 'h-8 w-8',
              className
            )}
            aria-label="Copy to clipboard"
          >
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copied!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

    