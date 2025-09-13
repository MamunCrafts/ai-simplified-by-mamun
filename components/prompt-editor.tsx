'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PromptEditorProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly maxLength?: number;
  readonly disabled?: boolean;
}

export function PromptEditor({ 
  value, 
  onChange, 
  maxLength = 5000, 
  disabled = false 
}: PromptEditorProps) {
  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.9;
  const isOverLimit = characterCount > maxLength;

  // Determine text color based on character count
  let countColor = 'text-gray-500 dark:text-gray-400';
  let bgColor = 'bg-emerald-50 dark:bg-emerald-950/20';
  
  if (isOverLimit) {
    countColor = 'text-red-500 font-bold';
    bgColor = 'bg-red-50 dark:bg-red-950/20';
  } else if (isNearLimit) {
    countColor = 'text-orange-500 font-semibold';
    bgColor = 'bg-orange-50 dark:bg-orange-950/20';
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="prompt-input" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        ✏️ Enter your prompt
      </Label>
      <div className="relative group">
        <Textarea
          id="prompt-input"
          placeholder="✨ Type or paste your rough prompt here... 

For example: 'help me write code for a login system'

🎯 Be as specific or as rough as you want - I'll make it beautiful!"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`min-h-40 resize-y border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 text-lg leading-relaxed group-hover:shadow-lg ${disabled ? 'opacity-50' : ''}`}
          maxLength={maxLength}
          disabled={disabled}
        />
        {!value.trim() && (
          <div className="absolute top-4 right-4 text-4xl opacity-20 pointer-events-none animate-pulse">
            📝
          </div>
        )}
      </div>
      
      <div className={`flex justify-between items-center p-3 rounded-lg border transition-all duration-300 ${bgColor}`}>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="animate-pulse">💭</span>
          <span>Enter a prompt to refine and structure</span>
        </div>
        <div className={`text-sm font-mono ${countColor} px-2 py-1 rounded-md bg-white/50 dark:bg-gray-800/50`}>
          {characterCount.toLocaleString()}/{maxLength.toLocaleString()}
        </div>
      </div>
      
      {value.trim() && (
        <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 p-4 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-300 animate-slide-up">
          <div className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div>
              <div className="font-semibold mb-1">Pro tip for amazing results:</div>
              <div>Be specific about what you want. Include context, constraints, and desired output format. The more details you provide, the better I can help structure your prompt!</div>
            </div>
          </div>
        </div>
      )}
      
      {isNearLimit && !isOverLimit && (
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 p-3 rounded-lg border-l-4 border-orange-400 animate-pulse">
          <div className="text-sm text-orange-800 dark:text-orange-200 flex items-center gap-2">
            <span>⚠️</span>
            <span>You're getting close to the character limit!</span>
          </div>
        </div>
      )}
      
      {isOverLimit && (
        <div className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 p-3 rounded-lg border-l-4 border-red-500 animate-pulse">
          <div className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
            <span>🚨</span>
            <span>You've exceeded the character limit! Please shorten your prompt.</span>
          </div>
        </div>
      )}
    </div>
  );
}