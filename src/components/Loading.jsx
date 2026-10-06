import { GraduationCap } from 'lucide-react';

const Loading = ({ label = 'Loading…', fullScreen = true }) => (
  <div
    role="status"
    aria-live="polite"
    className={`${fullScreen ? 'min-h-screen' : 'py-24'} flex items-center justify-center bg-gray-950`}
  >
    <div className="text-center">
      <div className="relative mx-auto mb-5 w-12 h-12">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <GraduationCap size={22} className="text-white" />
        </div>
      </div>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  </div>
);

export default Loading;
