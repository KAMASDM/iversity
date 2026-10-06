import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { blocksToSlides } from '../../utils/markdown';
import { Blocks } from './Markdown';

const isTyping = (el) =>
  el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

/** Presentation view of a lesson: one section per slide, arrow-key & swipe navigation. */
const LessonSlides = ({ blocks, onFinished }) => {
  const slides = useMemo(() => blocksToSlides(blocks), [blocks]);
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const total = slides.length;
  const safeIndex = Math.min(index, total - 1);
  const slide = slides[safeIndex];
  const isLast = safeIndex === total - 1;

  useEffect(() => {
    const onKey = (e) => {
      if (isTyping(document.activeElement) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight') setIndex(i => Math.min(i + 1, total - 1));
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  const onTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) setIndex(i => Math.max(0, Math.min(total - 1, i + (diff > 0 ? 1 : -1))));
    setTouchStartX(null);
  };

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#141a2e] to-slate-900 min-h-[340px] sm:min-h-[460px]"
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300"
            style={{ width: `${((safeIndex + 1) / total) * 100}%` }}
          />
        </div>

        <div key={safeIndex} className="animate-fade-in relative p-5 sm:p-10 lg:p-12">
          {slide.isTitle ? (
            <div className="flex min-h-[260px] sm:min-h-[360px] flex-col items-center justify-center text-center">
              <h2 className="max-w-3xl text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">{slide.title}</h2>
              <div className="mt-4 max-w-2xl text-left">
                <Blocks blocks={slide.blocks} compactCode />
              </div>
            </div>
          ) : (
            <>
              {slide.title && (
                <h3 className="mb-4 text-xl sm:text-3xl font-bold tracking-tight text-white">{slide.title}</h3>
              )}
              <Blocks blocks={slide.blocks} compactCode />
            </>
          )}
        </div>

        <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-medium text-gray-300">
          {safeIndex + 1} / {total}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setIndex(i => Math.max(i - 1, 0))}
          disabled={safeIndex === 0}
          className="flex items-center gap-1.5 rounded-xl bg-white/[0.06] px-4 py-2.5 text-sm text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <span className="hidden sm:block text-xs text-gray-500">Use ← → keys or swipe</span>
        <button
          onClick={() => (isLast ? onFinished?.() : setIndex(i => i + 1))}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-900/30 transition-opacity hover:opacity-90"
        >
          {isLast ? 'Finish slides' : 'Next'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default LessonSlides;
