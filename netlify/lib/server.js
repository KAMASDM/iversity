/**
 * Shared helpers for Netlify Functions.
 *
 * - Firebase Admin (token verification + privileged Firestore writes)
 * - requireUser(): verifies the caller's Firebase ID token
 * - rateLimit(): best-effort per-user limiter (per warm function instance)
 * - callOpenAI(): thin native-fetch wrapper around chat completions
 *
 * Environment variables (set in Netlify → Site settings → Environment):
 *   OPENAI_API_KEY          required for AI features
 *   FIREBASE_PROJECT_ID     falls back to VITE_FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL   } service-account credentials — required for the
 *   FIREBASE_PRIVATE_KEY    } final exam / certificate function (Firestore writes)
 */

const admin = require('firebase-admin');

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

// ── CORS / responses ─────────────────────────────────────────────────────────
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || process.env.URL || '*';

const CORS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ── Firebase Admin ───────────────────────────────────────────────────────────
function getAdmin() {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        projectId,
      });
    } else {
      // Token verification only needs the project ID (public signing certs).
      admin.initializeApp({ projectId });
    }
  }
  return admin;
}

function hasAdminCredentials() {
  return Boolean(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
}

// ── Auth ─────────────────────────────────────────────────────────────────────
async function requireUser(event) {
  const header = event.headers?.authorization || event.headers?.Authorization || '';
  const match = header.match(/^Bearer (.+)$/);
  if (!match) throw new HttpError(401, 'Sign in required');

  let decoded;
  try {
    decoded = await getAdmin().auth().verifyIdToken(match[1]);
  } catch {
    throw new HttpError(401, 'Invalid or expired session — please sign in again');
  }
  if (!decoded.email_verified) throw new HttpError(403, 'Please verify your email first');
  return decoded;
}

// ── Rate limiting (best effort: state lives per warm instance) ───────────────
const buckets = new Map();

function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const recent = (buckets.get(key) || []).filter(t => now - t < windowMs);
  if (recent.length >= limit) {
    throw new HttpError(429, "You're sending requests too quickly — give it a minute and try again.");
  }
  recent.push(now);
  buckets.set(key, recent);
}

// ── Request parsing ──────────────────────────────────────────────────────────
function parseBody(event) {
  try {
    return JSON.parse(event.body || '{}');
  } catch {
    throw new HttpError(400, 'Invalid JSON body');
  }
}

const clip = (value, max) => String(value ?? '').slice(0, max);

// ── OpenAI ───────────────────────────────────────────────────────────────────
async function callOpenAI(messages, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new HttpError(503, 'AI is not configured on this server.');

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages, ...options }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`OpenAI ${res.status}: ${text.slice(0, 300)}`);
    throw new HttpError(502, 'The AI service is temporarily unavailable.');
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function callOpenAIJson(messages, options = {}) {
  const text = await callOpenAI(messages, { ...options, response_format: { type: 'json_object' } });
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(502, 'The AI returned an unreadable response — please try again.');
  }
}

// ── Handler wrapper ──────────────────────────────────────────────────────────
function withHandler(fn) {
  return async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
    if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
    try {
      return json(200, await fn(event));
    } catch (err) {
      if (err instanceof HttpError) return json(err.statusCode, { error: err.message });
      console.error('[function error]', err);
      return json(500, { error: 'Internal server error' });
    }
  };
}

module.exports = {
  HttpError,
  getAdmin,
  hasAdminCredentials,
  requireUser,
  rateLimit,
  parseBody,
  clip,
  callOpenAI,
  callOpenAIJson,
  withHandler,
};
