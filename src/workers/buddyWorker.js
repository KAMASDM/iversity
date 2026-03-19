/**
 * buddyWorker.js — Web Worker for local AI inference
 *
 * Runs entirely off the main thread.  ONNX Runtime initialises cleanly inside
 * a Worker context because Vite never touches this file during bundling.
 *
 * Message protocol (main → worker):
 *   { type: 'load' }
 *   { type: 'query', id: string, question: string, context: string }
 *
 * Message protocol (worker → main):
 *   { type: 'progress', payload: { status, progress, file } }
 *   { type: 'ready' }
 *   { type: 'loadError', message: string }
 *   { type: 'queryResult', id: string, result: { answer, score } }
 *   { type: 'queryError', id: string, message: string }
 */
import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache   = true;   // cache model in IndexedDB after first download

let qaPipeline = null;

self.addEventListener('message', async ({ data }) => {
  if (data.type === 'load') {
    // ─── Load / warm the model ───────────────────────────────────────────────
    try {
      qaPipeline = await pipeline(
        'question-answering',
        'Xenova/distilbert-base-uncased-distilled-squad',
        {
          progress_callback: (p) =>
            self.postMessage({ type: 'progress', payload: p }),
        }
      );
      self.postMessage({ type: 'ready' });
    } catch (err) {
      self.postMessage({ type: 'loadError', message: err.message });
    }

  } else if (data.type === 'query') {
    // ─── Answer a question given a context string ─────────────────────────
    const { id, question, context } = data;
    if (!qaPipeline) {
      self.postMessage({ type: 'queryError', id, message: 'Model not loaded yet' });
      return;
    }
    try {
      const result = await qaPipeline({ question, context });
      self.postMessage({ type: 'queryResult', id, result });
    } catch (err) {
      self.postMessage({ type: 'queryError', id, message: err.message });
    }
  }
});
