import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    </div>
  );
};

export default LoadingState;