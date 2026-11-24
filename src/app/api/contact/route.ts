import { isIP } from 'node:net';
import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_RATE_LIMIT_ENTRIES = 10_000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5_000;

type RateLimitEntry = { count: number; windowStart: number };
type ContactFields = { name: string; email: string; subject: string; message: string };
const rateLimits = new Map<string, RateLimitEntry>();

function getClientKey(request: NextRequest): string {
  // Forwarded headers are spoofable unless the ingress proxy sanitizes them.
  // Trust them only when deployment explicitly confirms that proxy contract.
  if (process.env.CONTACT_TRUST_PROXY_HEADERS !== 'true') return 'shared';
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (!forwardedFor) return 'shared';

  const candidates = forwardedFor.split(',');
  const rightmost = candidates[candidates.length - 1]?.trim();
  return rightmost && isIP(rightmost) ? rightmost : 'shared';
}

function isRateLimited(clientKey: string, now: number): boolean {
  const entry = rateLimits.get(clientKey);
  if (entry && now - entry.windowStart < RATE_WINDOW_MS) {
    if (entry.count >= RATE_LIMIT) return true;
    entry.count += 1;
    return false;
  }

  if (rateLimits.size >= MAX_RATE_LIMIT_ENTRIES) {
    for (const [key, value] of rateLimits) {
      if (now - value.windowStart >= RATE_WINDOW_MS) rateLimits.delete(key);
    }
    if (rateLimits.size >= MAX_RATE_LIMIT_ENTRIES) {
      const oldestKey = rateLimits.keys().next().value;
      if (oldestKey !== undefined) rateLimits.delete(oldestKey);
    }
  }

  rateLimits.set(clientKey, { count: 1, windowStart: now });
  return false;
}

class RequestBodyError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

async function readJsonBody(request: NextRequest): Promise<unknown> {
  const contentLength = request.headers.get('content-length');
  if (contentLength && /^\d+$/.test(contentLength) && Number(contentLength) > MAX_BODY_BYTES) {
    throw new RequestBodyError(413, 'Request body is too large.');
  }
  if (!request.body) throw new RequestBodyError(400, 'Invalid JSON body.');

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestBodyError(413, 'Request body is too large.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) as unknown;
  } catch {
    throw new RequestBodyError(400, 'Invalid JSON body.');
  }
}

function validateContact(body: unknown): ContactFields | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const fields = body as Record<string, unknown>;
  if (
    typeof fields.name !== 'string' ||
    typeof fields.email !== 'string' ||
    typeof fields.message !== 'string' ||
    (fields.subject !== undefined && typeof fields.subject !== 'string')
  ) return null;

  const name = fields.name.trim();
  const email = fields.email.trim();
  const subject = typeof fields.subject === 'string' ? fields.subject.trim() : '';
  const message = fields.message.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    !name || name.length > MAX_NAME_LENGTH ||
    !email || email.length > MAX_EMAIL_LENGTH || !emailPattern.test(email) ||
    subject.length > MAX_SUBJECT_LENGTH ||
    !message || message.length > MAX_MESSAGE_LENGTH
  ) return null;
  return { name, email, subject, message };
}

export async function POST(request: NextRequest) {
  if (isRateLimited(getClientKey(request), Date.now())) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let contact: ContactFields | null;
  try {
    contact = validateContact(await readJsonBody(request));
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  if (!contact) {
    return NextResponse.json({ error: 'Invalid contact fields.' }, { status: 400 });
  }

  try {
    const db = getDb();
    const result = db.prepare(
      'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)'
    ).run(contact.name, contact.email, contact.subject, contact.message);
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
  return NextResponse.json(messages);
}
