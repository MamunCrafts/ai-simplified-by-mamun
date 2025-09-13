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
      <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group h-full">
        <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              ✨
            </div>
            Refined Prompt
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 min-h-[400px] flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-emerald-500 mx-auto" />
                <div className="absolute inset-0 h-16 w-16 bg-emerald-500/20 rounded-full animate-ping mx-auto"></div>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  🪄 Crafting your perfect prompt...
                </p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group h-full">
        <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              ✨
            </div>
            Refined Prompt
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 min-h-[400px] flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">😅</div>
              <div className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 p-6 rounded-xl border-l-4 border-red-500">
                <p className="font-bold text-red-800 dark:text-red-200 mb-2">
                  Oops! Something went wrong
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {error}
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Don't worry, try again or contact support! 🛠️
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!refined) {
    return (
      <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group h-full">
        <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              ✨
            </div>
            Refined Prompt
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 min-h-[400px] flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="text-8xl animate-bounce-slow">🎨</div>
              <div className="space-y-3">
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  Ready for magic! ✨
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Enter your prompt and click "Beautify" to see the transformation! 🚀
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 dark:from-purple-900/50 dark:via-blue-900/50 dark:to-indigo-900/50 p-4 rounded-xl">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💡 Your refined prompt will appear here with beautiful formatting and structure
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group h-full">
      <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              ✨
            </div>
            Refined Prompt
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-white hover:bg-white/20 transition-colors duration-300 group/copy"
              disabled={!refined}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-200" />
                  <span className="text-green-200">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2 group-hover/copy:scale-110 transition-transform duration-300" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-white hover:bg-white/20 transition-colors duration-300 group/download"
              disabled={!refined}
            >
              <Download className="h-4 w-4 mr-2 group-hover/download:scale-110 transition-transform duration-300" />
              Download
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 min-h-[400px] flex flex-col">
        <div className="flex-1">
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 p-6 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-lg transition-shadow duration-300 h-full">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                {refined}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
          <span>💡</span>
          <span>You can copy this refined prompt or download it as a text file for later use.</span>
          <span>✨</span>
        </div>
      </CardContent>
    </Card>
  );
}