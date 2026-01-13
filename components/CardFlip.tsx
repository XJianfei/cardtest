import React from 'react';

interface CardFlipProps {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped: boolean;
  onClick: () => void;
  colorClass?: string;
}

export const CardFlip: React.FC<CardFlipProps> = ({ 
  front, 
  back, 
  isFlipped, 
  onClick,
  colorClass = 'bg-white'
}) => {
  return (
    <div 
      className="w-full max-w-lg h-80 sm:h-96 cursor-pointer perspective-1000 group"
      onClick={onClick}
    >
      <div 
        className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Face */}
        <div className={`absolute w-full h-full backface-hidden shadow-xl rounded-2xl p-8 flex flex-col justify-center items-center text-center border border-slate-200 ${colorClass}`}>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Question</div>
          <div className="text-2xl sm:text-3xl font-semibold text-slate-800 leading-relaxed">
            {front}
          </div>
          <div className="absolute bottom-6 text-slate-400 text-sm flex items-center gap-2">
            <span>Click to flip</span>
          </div>
        </div>

        {/* Back Face */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 shadow-xl rounded-2xl p-8 flex flex-col justify-center items-center text-center border border-indigo-100 bg-indigo-50`}>
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">Answer</div>
          <div className="text-xl sm:text-2xl font-medium text-slate-800 leading-relaxed">
            {back}
          </div>
        </div>
      </div>
    </div>
  );
};