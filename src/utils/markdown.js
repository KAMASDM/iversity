/**
 * Minimal markdown → block parser for lesson content.
 * Supports headings (#, ##, ###), paragraphs, bullet & numbered lists,
 * fenced code blocks, tables, blockquotes and horizontal rules.
 */

const stripInline = (str) => str
  .replace(/\*\*(.*?)\*\*/g, '$1')
  .replace(/\*(.*?)\*/g, '$1')
  .replace(/`(.*?)`/g, '$1')
  .trim();

export function parseBlocks(text = '') {
  const blocks = [];
  const lines = text.split('\n');
  let list = null;
  let table = null;
  let quote = null;
  let code = null;

  const flush = () => {
    if (list) { blocks.push(list); list = null; }
    if (table) {
      const rows = table.rows.filter(row => !row.every(cell => /^[-:\s]+$/.test(cell)));
      if (rows.length) blocks.push({ type: 'table', rows });
      table = null;
    }
    if (quote) { blocks.push(quote); quote = null; }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Fenced code
    if (line.startsWith('```')) {
      if (code) {
        blocks.push(code);
        code = null;
      } else {
        flush();
        code = { type: 'code', language: line.slice(3).trim(), text: '' };
      }
      continue;
    }
    if (code) {
      code.text += (code.text ? '\n' : '') + rawLine;
      continue;
    }

    // Tables
    if (line.startsWith('|')) {
      if (!table) { flush(); table = { rows: [] }; }
      table.rows.push(line.split('|').slice(1, -1).map(c => c.trim()));
      continue;
    }

    // Blockquotes
    if (line.startsWith('>')) {
      if (!quote) { flush(); quote = { type: 'quote', lines: [] }; }
      quote.lines.push(line.replace(/^>\s?/, ''));
      continue;
    }

    // Lists
    const bullet = line.match(/^[-*]\s+(.*)/);
    const numbered = line.match(/^\d+[.)]\s+(.*)/);
    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      if (!list || list.ordered !== ordered) {
        flush();
        list = { type: 'list', ordered, items: [] };
      }
      list.items.push((bullet || numbered)[1]);
      continue;
    }

    flush();
    if (!line) continue;

    const heading = line.match(/^(#{1,4})\s+(.*)/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: stripInline(heading[2]) });
    } else if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      blocks.push({ type: 'hr' });
    } else {
      blocks.push({ type: 'paragraph', text: line });
    }
  }

  if (code) blocks.push(code);
  flush();
  return blocks;
}

/** Split blocks into presentation slides at level-1 and level-2 headings. */
export function blocksToSlides(blocks) {
  const slides = [];
  let current = null;

  for (const block of blocks) {
    if (block.type === 'heading' && block.level <= 2) {
      if (current && (current.title || current.blocks.length)) slides.push(current);
      current = { title: block.text, isTitle: block.level === 1, blocks: [] };
    } else {
      if (!current) current = { title: '', isTitle: false, blocks: [] };
      current.blocks.push(block);
    }
  }
  if (current && (current.title || current.blocks.length)) slides.push(current);
  return slides.length ? slides : [{ title: '', isTitle: false, blocks }];
}

/** Section headings for the in-lesson table of contents. */
export function headingsOf(blocks) {
  return blocks
    .map((b, index) => ({ ...b, index }))
    .filter(b => b.type === 'heading' && b.level === 2);
}

export function estimateMinutes(text = '') {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
