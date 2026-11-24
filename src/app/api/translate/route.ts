import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { autoTranslate } from '@/lib/translate';

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
