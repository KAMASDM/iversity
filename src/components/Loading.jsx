import { Loader } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader className="animate-spin text-primary-600 mx-auto mb-4" size={48} />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
