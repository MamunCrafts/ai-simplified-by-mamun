'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check, Loader2 } from 'lucide-react';

interface PreviewCardProps {
  readonly refined: string;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export function PreviewCard({ refined, isLoading = false, error }: PreviewCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(refined);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (clipboardError) {
      console.error('Failed to copy to clipboard:', clipboardError);
      // Fallback for older browsers or clipboard API failures
      try {
        const textArea = document.createElement('textarea');
        textArea.value = refined;
        document.body.appendChild(textArea);
        textArea.select();
        // eslint-disable-next-line deprecation/deprecation
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([refined], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `refined-prompt-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error('Download failed:', downloadError);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Refining your prompt...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            This may take a few seconds...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-300">
            Error Refining Prompt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try again with a different prompt or check your connection.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!refined) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-8 pb-8">
          <div className="text-center text-muted-foreground">
            <div className="mb-2">✨</div>
            <p className="text-lg font-medium">Refined prompt will appear here</p>
            <p className="text-sm mt-1">
              Enter your prompt on the left and click "Refine" to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Refined Prompt</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={copied}
              title={copied ? 'Copied!' : 'Copy to clipboard'}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              title="Download as text file"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap break-words p-4 bg-muted/50 rounded-lg border">
            {refined}
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          💡 You can copy this refined prompt or download it as a text file for later use.
        </div>
      </CardContent>
    </Card>
  );
}