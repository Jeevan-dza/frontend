import React from 'react';
import { CompareSwipeMap } from '../components/CompareSwipeMap';

export const ComparePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050816] p-4 md:p-6 max-w-7xl mx-auto pb-20 md:pb-8">
      <CompareSwipeMap />
    </div>
  );
};
