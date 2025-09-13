'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PromptEditor } from '@/components/prompt-editor';
import { PreviewCard } from '@/components/preview-card';
import { Wand2, Sparkles } from 'lucide-react';
import { Header } from '@/components/landing-page/header';

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
    <>
      <Header/>
      {/* Animated Background */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
        {/* Floating Animation Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto py-12 px-4 max-w-7xl relative z-10">
          
          {/* Animated Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6 group">
              <div className="relative">
                <Sparkles className="h-12 w-12 text-purple-600 animate-spin-slow" />
                <div className="absolute inset-0 h-12 w-12 bg-purple-600/20 rounded-full animate-ping"></div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                Prompt Beautifier
              </h1>
              <div className="relative">
                <Wand2 className="h-12 w-12 text-indigo-600 animate-bounce" />
                <div className="absolute inset-0 h-12 w-12 bg-indigo-600/20 rounded-full animate-ping delay-500"></div>
              </div>
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              ✨ Transform your rough prompts into <span className="font-semibold text-purple-600">clear</span>, 
              <span className="font-semibold text-blue-600"> structured</span>, and 
              <span className="font-semibold text-indigo-600"> effective</span> instructions with AI magic! 🚀
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-slide-up delay-300">
            {/* Enhanced Input Section */}
            <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group">
              <CardHeader className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                    ✍️
                  </div>
                  Input Your Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <PromptEditor
                  value={rawPrompt}
                  onChange={setRawPrompt}
                  disabled={isLoading}
                />
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="preset" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      🎨 Style Preset
                    </Label>
                    <Select 
                      value={preset} 
                      onValueChange={(value: Preset) => setPreset(value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-12 border-2 border-purple-200 hover:border-purple-400 transition-colors duration-300 bg-gradient-to-r from-purple-50 to-blue-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-lg">
                        <SelectItem value="concise" className="hover:bg-purple-100">
                          ⚡ Concise - Clear and direct
                        </SelectItem>
                        <SelectItem value="developer" className="hover:bg-blue-100">
                          💻 Developer - Technical focus
                        </SelectItem>
                        <SelectItem value="teacher" className="hover:bg-green-100">
                          📚 Teacher - Educational style
                        </SelectItem>
                        <SelectItem value="analyst" className="hover:bg-orange-100">
                          📊 Analyst - Data-driven approach
                        </SelectItem>
                        <SelectItem value="product" className="hover:bg-indigo-100">
                          🎯 Product - Business context
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="maxWords" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      📝 Max Words
                    </Label>
                    <Select 
                      value={maxWords.toString()} 
                      onValueChange={(value) => setMaxWords(parseInt(value))}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-12 border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-lg">
                        <SelectItem value="100">📄 100 words</SelectItem>
                        <SelectItem value="200">📑 200 words</SelectItem>
                        <SelectItem value="300">📋 300 words</SelectItem>
                        <SelectItem value="500">📰 500 words</SelectItem>
                        <SelectItem value="1000">📚 1000 words</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleRefine} 
                  disabled={isRefineDisabled}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  size="lg"
                >
                  <div className="flex items-center gap-3">
                    <Wand2 className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Crafting magic...
                      </>
                    ) : (
                      '✨ Beautify My Prompt'
                    )}
                  </div>
                </Button>

                {/* Enhanced Usage Tips */}
                <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 dark:from-purple-900/50 dark:via-blue-900/50 dark:to-indigo-900/50 p-6 rounded-xl border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
                  <div className="font-bold mb-3 text-purple-800 dark:text-purple-200 flex items-center gap-2">
                    💡 Pro Tips for Amazing Results:
                  </div>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500">🎯</span>
                      Be specific about your goals and constraints
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">👥</span>
                      Include context about your audience or use case
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500">📋</span>
                      Mention desired output format if relevant
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Output Section */}
            <div className="animate-slide-left delay-500">
              <PreviewCard 
                refined={refinedPrompt} 
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>

          {/* Enhanced Examples Section */}
          <div className="mt-20 animate-slide-up delay-700">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                ✨ See the Magic in Action
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Watch how we transform messy prompts into polished masterpieces! 🎭
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="backdrop-blur-lg bg-red-50/80 dark:bg-red-950/50 border-2 border-red-200 hover:border-red-400 transition-all duration-500 hover:scale-105 hover:shadow-xl group">
                <CardHeader className="bg-gradient-to-r from-red-400 to-pink-500 text-white">
                  <CardTitle className="text-xl flex items-center gap-2">
                    😵 Before (Messy)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-white/50 p-4 rounded-lg italic text-gray-700 dark:text-gray-300 group-hover:bg-white/70 transition-colors duration-300">
                    "write me some code for user login stuff with database and make it secure"
                  </div>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-lg bg-green-50/80 dark:bg-green-950/50 border-2 border-green-200 hover:border-green-400 transition-all duration-500 hover:scale-105 hover:shadow-xl group">
                <CardHeader className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                  <CardTitle className="text-xl flex items-center gap-2">
                    ✨ After (Beautiful!)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-white/50 p-4 rounded-lg text-gray-700 dark:text-gray-300 group-hover:bg-white/70 transition-colors duration-300">
                    <div className="font-semibold mb-2">Create a secure user authentication system with:</div>
                    <div className="space-y-1 text-sm">
                      <div>🔐 Username/email and password login</div>
                      <div>🛡️ Password hashing with bcrypt</div>
                      <div>⚡ Session management</div>
                      <div>🔍 Input validation and SQL injection protection</div>
                      <div>🚦 Rate limiting for login attempts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Fun Call-to-Action */}
          <div className="mt-16 text-center animate-bounce-slow">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              🚀 Ready to create perfect prompts? Let's go! ✨
            </div>
          </div>
        </div>
      </div>
    </>
  );
}