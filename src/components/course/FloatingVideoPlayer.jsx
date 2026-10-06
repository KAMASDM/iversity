import { useCallback, useEffect, useRef, useState } from 'react';
import { Minus, X, Youtube } from 'lucide-react';

// Load the YouTube IFrame API script once
const ensureYouTubeAPI = () => {
  if (window.YT?.Player || document.getElementById('yt-api-script')) return;
  const tag = document.createElement('script');
  tag.id = 'yt-api-script';
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
};

const extractVideoId = (rawUrl) => {
  try {
    const u = new URL(rawUrl);
    return u.searchParams.get('v') || u.pathname.replace(/^\/(shorts\/|embed\/)?/, '').split('/')[0];
  } catch {
    return null;
  }
};

// Floating YouTube Video Player — saves watch position to localStorage
const FloatingVideoPlayer = ({ url, title, lessonId, userId, onClose }) => {
  const [minimised, setMinimised] = useState(false);
  const divRef = useRef(null);
  const playerRef = useRef(null);
  const saveTimerRef = useRef(null);
  const storageKey = `vp_${userId}_${lessonId}`;

  const saveCurrentTime = useCallback(() => {
    try {
      if (playerRef.current?.getCurrentTime) {
        localStorage.setItem(storageKey, String(Math.floor(playerRef.current.getCurrentTime())));
      }
    } catch { /* ignore */ }
  }, [storageKey]);

  const initPlayer = useCallback(() => {
    if (!divRef.current || !window.YT?.Player) return;
    const videoId = extractVideoId(url);
    if (!videoId) return;
    let start = 0;
    try { start = parseInt(localStorage.getItem(storageKey) || '0', 10); } catch { /* ignore */ }
    playerRef.current = new window.YT.Player(divRef.current, {
      videoId,
      playerVars: { autoplay: 1, start, rel: 0 },
      events: {
        onStateChange: ({ data }) => {
          clearInterval(saveTimerRef.current);
          if (data === window.YT.PlayerState.PLAYING) {
            saveTimerRef.current = setInterval(saveCurrentTime, 5000);
          } else {
            saveCurrentTime();
          }
        },
      },
    });
  }, [url, storageKey, saveCurrentTime]);

  useEffect(() => {
    ensureYouTubeAPI();
    if (window.YT?.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        initPlayer();
      };
    }
    return () => {
      clearInterval(saveTimerRef.current);
      saveCurrentTime();
      playerRef.current?.destroy?.();
    };
  }, [initPlayer, saveCurrentTime]);

  return (
    <div
      className={`fixed z-50 overflow-hidden rounded-2xl border border-white/15 bg-[#0d1117] shadow-2xl shadow-black/60 transition-all duration-300 bottom-20 lg:bottom-4 right-4 ${
        minimised ? 'w-64' : 'w-[calc(100vw-2rem)] sm:w-[480px]'
      }`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-3 py-2.5">
        <Youtube size={16} className="shrink-0 text-red-400" />
        <span className="flex-1 truncate text-xs font-medium text-white">{title || 'Video'}</span>
        <button
          onClick={() => setMinimised(m => !m)}
          className="rounded p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={minimised ? 'Restore video' : 'Minimise video'}
        >
          <Minus size={14} />
        </button>
        <button
          onClick={() => { saveCurrentTime(); onClose(); }}
          className="rounded p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close video"
        >
          <X size={14} />
        </button>
      </div>

      {/* Always mounted so the video keeps running when minimised */}
      <div className={minimised ? 'hidden' : 'aspect-video'}>
        <div ref={divRef} className="h-full w-full" />
      </div>
    </div>
  );
};

export default FloatingVideoPlayer;
