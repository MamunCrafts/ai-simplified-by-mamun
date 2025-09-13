'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PromptEditor } from '@/components/prompt-editor';
import { PreviewCard } from '@/components/preview-card';
import { Wand2, Sparkles } from 'lucide-react';

type Preset = 'concise' | 'developer' | 'teacher' | 'analyst' | 'product';

interface RefineResponse {
  refined: string;
}

interface RefineError {
  error: string;
  details?: string[];
}

export default function PromptBeautifierPage() {
  const [rawPrompt, setRawPrompt] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [preset, setPreset] = useState<Preset>('concise');
  const [maxWords, setMaxWords] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleRefine = async () => {
    const trimmedPrompt = rawPrompt.trim();
    
    if (!trimmedPrompt) {
      setError('Please enter a prompt to refine');
      return;
    }

    if (trimmedPrompt.length > 10000) {
      setError('Prompt is too long. Please keep it under 10,000 characters.');
      return;
    }

    setIsLoading(true);
    setRefinedPrompt('');
    setError('');

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: trimmedPrompt,
          preset,
          maxWords,
        }),
      });

      if (!response.ok) {
        const errorData: RefineError = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data: RefineResponse = await response.json();
      setRefinedPrompt(data.refined);
    } catch (fetchError) {
      console.error('Error refining prompt:', fetchError);
      
      if (fetchError instanceof Error) {
        if (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('NetworkError')) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError(fetchError.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isRefineDisabled = isLoading || !rawPrompt.trim() || rawPrompt.trim().length > 10000;

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Prompt Beautifier</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Transform your rough prompts into clear, structured, and effective instructions. 
          Perfect for AI interactions, documentation, and task management.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Input Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PromptEditor
              value={rawPrompt}
              onChange={setRawPrompt}
              disabled={isLoading}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preset">Style Preset</Label>
                <Select 
                  value={preset} 
                  onValueChange={(value: Preset) => setPreset(value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concise">Concise - Clear and direct</SelectItem>
                    <SelectItem value="developer">Developer - Technical focus</SelectItem>
                    <SelectItem value="teacher">Teacher - Educational style</SelectItem>
                    <SelectItem value="analyst">Analyst - Data-driven approach</SelectItem>
                    <SelectItem value="product">Product - Business context</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxWords">Max Words</Label>
                <Select 
                  value={maxWords.toString()} 
                  onValueChange={(value) => setMaxWords(parseInt(value))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 words</SelectItem>
                    <SelectItem value="200">200 words</SelectItem>
                    <SelectItem value="300">300 words</SelectItem>
                    <SelectItem value="500">500 words</SelectItem>
                    <SelectItem value="1000">1000 words</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleRefine} 
              disabled={isRefineDisabled}
              className="w-full"
              size="lg"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {isLoading ? 'Refining...' : 'Refine Prompt'}
            </Button>

            {/* Usage Tips */}
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <div className="font-medium mb-1">💡 Tips for better results:</div>
              <ul className="space-y-1">
                <li>• Be specific about your goals and constraints</li>
                <li>• Include context about your audience or use case</li>
                <li>• Mention desired output format if relevant</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <PreviewCard 
          refined={refinedPrompt} 
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Examples Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Example Transformations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Before</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                "write me some code for user login stuff with database and make it secure"
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">After</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Create a secure user authentication system with the following requirements:
                <br />• Username/email and password login
                <br />• Password hashing with bcrypt
                <br />• Session management
                <br />• Input validation and SQL injection protection
                <br />• Rate limiting for login attempts
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}