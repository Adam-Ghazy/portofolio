import { NextResponse } from 'next/server';
import { autoTranslate } from '@/lib/translate';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, from = 'id', to = 'en' } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ translatedText: '' });
    }

    const translatedText = await autoTranslate(text, from, to);
    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('API /api/translate error:', error);
    return NextResponse.json(
      { error: 'Translation failed', translatedText: '' },
      { status: 500 }
    );
  }
}
