import { useState } from 'react';
import { Check, Copy, Quote } from 'lucide-react';

const SAFE_URL = /^(https?:|mailto:)/i;

// Inline markdown → JSX: **bold**, *italic*, `code`, [links](https://…)
const renderInline = (text) => {
  const parts = [];
  const regex = /(\*\*.+?\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\s][^*]*?\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={key++} className="font-semibold text-white">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded-md bg-white/10 text-violet-200 text-[0.9em] font-mono">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[')) {
      const [, label, href] = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      parts.push(SAFE_URL.test(href)
        ? <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline underline-offset-2 hover:text-blue-200">{label}</a>
        : label);
    } else {
      parts.push(<em key={key++} className="italic text-gray-200">{token.slice(1, -1)}</em>);
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
};

export const CodeBlock = ({ language, text, compact = false }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0b0f17]">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.04] border-b border-white/10">
        <span className="text-[11px] text-gray-400 font-mono uppercase tracking-wider">{language || 'code'}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white px-1.5 py-0.5 rounded transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={`p-4 overflow-x-auto ${compact ? 'max-h-64' : ''}`}>
        <code className="text-[13px] leading-relaxed font-mono text-emerald-200 whitespace-pre">{text}</code>
      </pre>
    </div>
  );
};

const Table = ({ rows }) => (
  <div className="overflow-x-auto rounded-xl border border-white/10">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-white/[0.06]">
          {rows[0].map((cell, i) => (
            <th key={i} className="px-4 py-2.5 text-left font-semibold text-gray-100 border-b border-white/10">{renderInline(cell)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.slice(1).map((row, r) => (
          <tr key={r} className="even:bg-white/[0.02]">
            {row.map((cell, i) => (
              <td key={i} className="px-4 py-2.5 text-gray-300 border-b border-white/5 align-top">{renderInline(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Renders parsed blocks as a comfortable long-form article. */
export const Blocks = ({ blocks, idPrefix = 'sec', compactCode = false }) => (
  <>
    {blocks.map((block, i) => {
      switch (block.type) {
        case 'heading': {
          if (block.level === 1) {
            return <h2 key={i} className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2 mb-4">{block.text}</h2>;
          }
          if (block.level === 2) {
            return (
              <h3 key={i} id={`${idPrefix}-${i}`} className="scroll-mt-28 text-xl sm:text-2xl font-semibold text-white tracking-tight mt-10 mb-3">
                {block.text}
              </h3>
            );
          }
          return <h4 key={i} className="text-base sm:text-lg font-semibold text-violet-200 mt-7 mb-2">{block.text}</h4>;
        }
        case 'paragraph':
          return <p key={i} className="text-[15px] sm:text-[17px] leading-[1.75] text-gray-300 my-4">{renderInline(block.text)}</p>;
        case 'list': {
          const Tag = block.ordered ? 'ol' : 'ul';
          return (
            <Tag key={i} className={`my-4 space-y-2 pl-6 text-[15px] sm:text-[17px] leading-[1.7] text-gray-300 ${block.ordered ? 'list-decimal marker:text-violet-300 marker:font-semibold' : 'list-disc marker:text-blue-400'}`}>
              {block.items.map((item, j) => <li key={j} className="pl-1">{renderInline(item)}</li>)}
            </Tag>
          );
        }
        case 'code':
          return <div key={i} className="my-5"><CodeBlock language={block.language} text={block.text} compact={compactCode} /></div>;
        case 'table':
          return <div key={i} className="my-5"><Table rows={block.rows} /></div>;
        case 'quote':
          return (
            <blockquote key={i} className="my-5 flex gap-3 rounded-xl border border-blue-500/20 bg-blue-500/[0.07] px-4 py-3">
              <Quote size={16} className="mt-1 shrink-0 text-blue-300" />
              <div className="space-y-1 text-[15px] sm:text-base leading-relaxed text-blue-50/90">
                {block.lines.map((line, j) => <p key={j}>{renderInline(line)}</p>)}
              </div>
            </blockquote>
          );
        case 'hr':
          return <hr key={i} className="my-8 border-white/10" />;
        default:
          return null;
      }
    })}
  </>
);
