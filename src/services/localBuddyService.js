/**
 * Local Buddy Service — zero-dependency extractive QA
 *
 * No ONNX. No ML model. No API. No worker. No quota. Instant.
 *
 * Algorithm:
 *   1. Parse the RAG context string into source-labelled chunks
 *   2. Split each chunk into individual sentences
 *   3. Score each sentence against query keywords (TF-IDF style)
 *   4. Return the top-scoring sentence(s) as a formatted answer
 *
 * This is classical information-retrieval-based extractive QA — the same
 * technique used by search engines before deep learning.
 */

const STOP_WORDS = new Set([
  'a','an','the','is','are','was','were','be','been','have','has','had',
  'do','does','did','will','would','could','should','may','might','can',
  'i','me','my','we','our','you','your','he','she','it','they','them',
  'this','that','these','those','and','or','but','in','on','at','to',
  'for','of','with','about','what','how','when','where','who','which',
  'why','please','tell','explain','give','show','describe','list',
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));
}

function scoreText(queryTokens, text) {
  if (!queryTokens.length) return 0;
  const lower = text.toLowerCase();
  let score = 0;
  for (const token of queryTokens) {
    const count = (lower.match(new RegExp(`\\b${token}`, 'g')) || []).length;
    if (count > 0) score += 1 + Math.log(count);
  }
  return score;
}

function splitSentences(text) {
  return text
    .replace(/\n+/g, ' ')
    .split(/\.\s+|!\s+|\?\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 25);
}

// No async loading needed — always ready instantly
export function isLocalBuddyReady() { return true; }
export function loadLocalBuddy()    { return Promise.resolve(); }

/**
 * Answer a question by extracting the best-matching sentences from the
 * RAG-retrieved context string.  Pure JS — no ML, no API, no network calls.
 *
 * @param {string} question
 * @param {string} ragContext  — output of retrieveContext()
 * @returns {Promise<string>}
 */
export async function askLocalBuddy(question, ragContext) {
  if (!ragContext || ragContext.trim().length < 10) {
    return (
      "I don't have specific information about that in my knowledge base. " +
      "Try asking about something from the course content, or browse the Courses page!"
    );
  }

  const queryTokens = tokenize(question);

  // Parse the formatted context string into { source, text } objects
  const chunks = ragContext.split('\n\n---\n\n').map(raw => {
    const trimmed  = raw.trim();
    const srcMatch = trimmed.match(/^\[([^\]]+)\]/);
    const source   = srcMatch ? srcMatch[1] : null;
    const body     = srcMatch ? trimmed.slice(srcMatch[0].length).trim() : trimmed;
    return { source, text: body };
  }).filter(c => c.text.length > 0);

  if (chunks.length === 0) {
    return "I couldn't find anything relevant. Could you rephrase your question?";
  }

  // Score every sentence in every chunk against the query
  const candidates = [];
  for (const chunk of chunks) {
    for (const sentence of splitSentences(chunk.text)) {
      candidates.push({
        text:   sentence,
        source: chunk.source,
        score:  scoreText(queryTokens, sentence),
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  const top = candidates.filter(c => c.score > 0).slice(0, 3);

  // No keyword matches — return intro sentences from the best chunk
  if (top.length === 0) {
    const intro = splitSentences(chunks[0].text).slice(0, 2).join('. ');
    const src   = chunks[0].source;
    return [
      src ? `Here's what I found from "${src}":` : `Here's what I found:`,
      '',
      intro || chunks[0].text.slice(0, 300),
      '',
      'Could you ask something more specific?',
    ].join('\n');
  }

  // Take the top 2 sentences from the highest-ranked source
  const bestSource = top[0].source;
  const answer = top
    .filter(c => c.source === bestSource)
    .slice(0, 2)
    .map(c => c.text)
    .join(' ');

  const followUp = top[0].score > 3
    ? 'Want me to go deeper on any part of this?'
    : 'Feel free to ask a follow-up if you need more detail!';

  return [
    bestSource ? `From "${bestSource}":` : null,
    '',
    answer,
    '',
    followUp,
  ].filter(l => l !== null).join('\n');
}
