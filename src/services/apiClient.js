/**
 * Authenticated calls to our Netlify Functions.
 * Attaches the signed-in user's Firebase ID token so the server can verify them.
 */
import { auth } from '../config/firebase';

export async function callFunction(name, body, { timeoutMs = 25000 } = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Please sign in again.');
  const token = await user.getIdToken();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(`/.netlify/functions/${name}`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('The request timed out — please try again.');
    throw new Error('Network error — check your connection and try again.');
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || `Request failed (HTTP ${res.status})`);
    error.status = res.status;
    throw error;
  }
  return data;
}
