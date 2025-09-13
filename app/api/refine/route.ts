import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { refinePrompt } from '@/lib/refiners/serverRefiner';

const requestSchema = z.object({
  raw: z.string().min(1, 'Prompt cannot be empty').max(10000, 'Prompt too long (max 10,000 characters)'),
  preset: z.enum(['concise', 'developer', 'teacher', 'analyst', 'product']).default('concise'),
  maxWords: z.number().min(10, 'Minimum 10 words').max(1000, 'Maximum 1000 words').default(300)
});

const responseSchema = z.object({
  refined: z.string()
});

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);
  
  // Reset if time window expired
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }
  
  // Check if limit exceeded
  if (limit.count >= 20) { // 20 requests per minute
    return false;
  }
  
  // Increment count
  limit.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  // Try to get real IP from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback to request IP
  return request.ip || 'unknown';
}

function handleAPIError(error: unknown): NextResponse {
  console.error('API error:', error);

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    return NextResponse.json(
      { error: 'Validation failed', details: errorMessages },
      { status: 400 }
    );
  }

  // Handle timeout
  if (error instanceof Error && error.message === 'Request timeout') {
    return NextResponse.json(
      { error: 'Request timeout. Please try again with a shorter prompt.' },
      { status: 408 }
    );
  }

  // Handle specific error messages
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Service configuration error. Please contact support.' },
        { status: 500 }
      );
    }
    
    if (error.message.includes('quota') || error.message.includes('limit')) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable due to high demand. Please try again later.' },
        { status: 503 }
      );
    }
  }

  // Generic error
  return NextResponse.json(
    { error: 'An unexpected error occurred. Please try again.' },
    { status: 500 }
  );
}

export async function POST(request: NextRequest) {
  try {
    console.log('Received refine request', process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    // Check if API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('Google AI API key not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 500 }
      );
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const validatedData = requestSchema.parse(body);

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 15000) // 15 seconds
    );

    // Call refiner with timeout
    const refinePromise = refinePrompt(validatedData);
    const result = await Promise.race([refinePromise, timeoutPromise]);

    // Validate response
    const validatedResponse = responseSchema.parse(result);

    return NextResponse.json(validatedResponse);

  } catch (error) {
    return handleAPIError(error);
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}