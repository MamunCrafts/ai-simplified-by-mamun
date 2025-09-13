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
  let countColor = 'text-muted-foreground';
  if (isOverLimit) {
    countColor = 'text-red-500';
  } else if (isNearLimit) {
    countColor = 'text-orange-500';
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="prompt-input">Enter your prompt</Label>
      <Textarea
        id="prompt-input"
        placeholder="Type or paste your rough prompt here... For example: 'help me write code for a login system'"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-32 resize-y"
        maxLength={maxLength}
        disabled={disabled}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Enter a prompt to refine and structure</span>
        <span className={countColor}>
          {characterCount.toLocaleString()}/{maxLength.toLocaleString()}
        </span>
      </div>
      {value.trim() && (
        <div className="text-xs text-muted-foreground">
          💡 Tip: Be specific about what you want. Include context, constraints, and desired output format.
        </div>
      )}
    </div>
  );
}