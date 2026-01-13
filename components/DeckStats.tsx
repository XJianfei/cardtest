import React from 'react';
import { Deck } from '../types';
import { ArrowLeft, CheckCircle2, Circle, PieChart, AlertCircle, Pencil } from 'lucide-react';

interface DeckStatsProps {
  deck: Deck;
  onBack: () => void;
  onEdit: () => void;
}

export const DeckStats: React.FC<DeckStatsProps> = ({ deck, onBack, onEdit }) => {
  const totalCards = deck.cards.length;
  const masteredCount = deck.cards.filter(c => c.mastered).length;
  const learningCount = totalCards - masteredCount;
  const masteryPercentage = Math.round((masteredCount / totalCards) * 100) || 0;

  // SVG Chart Calculations
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(masteryPercentage / 100) * circumference} ${circumference}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-800 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{deck.title} Stats</h2>
            <p className="text-slate-500 text-sm">Track your learning progress</p>
          </div>
        </div>
        <button 
          onClick={onEdit}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors rounded-full"
          title="Edit Deck"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Main Chart Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[300px]">
           <div className="relative w-48 h-48">
             {/* Background Circle */}
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.8"
                />
                {/* Progress Circle */}
                <path
                  className="text-indigo-600 transition-all duration-1000 ease-out"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.8"
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-4xl font-bold text-slate-800">{masteryPercentage}%</span>
               <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Mastered</span>
             </div>
           </div>
           
           <div className="flex gap-8 mt-8">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-sm font-medium text-slate-600">Got it ({masteredCount})</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <span className="text-sm font-medium text-slate-600">Still Learning ({learningCount})</span>
             </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-rows-3 gap-4">
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div>
              <p className="text-indigo-600 font-medium mb-1">Total Cards</p>
              <p className="text-3xl font-bold text-indigo-900">{totalCards}</p>
            </div>
            <div className="p-3 bg-white/50 rounded-xl text-indigo-600">
              <PieChart className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium mb-1">Mastered</p>
              <p className="text-3xl font-bold text-green-900">{masteredCount}</p>
            </div>
            <div className="p-3 bg-white/50 rounded-xl text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-center justify-between">
            <div>
              <p className="text-orange-600 font-medium mb-1">Remaining</p>
              <p className="text-3xl font-bold text-orange-900">{learningCount}</p>
            </div>
            <div className="p-3 bg-white/50 rounded-xl text-orange-600">
              <Circle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Needs Review Section */}
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-orange-500" />
        Focus Areas (Still Learning)
      </h3>
      
      {learningCount === 0 ? (
        <div className="p-8 bg-green-50 rounded-2xl border border-green-100 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-green-800">All caught up!</h4>
          <p className="text-green-600">You have mastered all cards in this deck.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {deck.cards.filter(c => !c.mastered).map((card, idx) => (
            <div 
              key={card.id}
              className={`p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors flex gap-4`}
            >
              <span className="text-xs font-bold text-slate-300 mt-1">#{idx + 1}</span>
              <div className="flex-1">
                <p className="font-medium text-slate-800 mb-1">{card.front}</p>
                <p className="text-sm text-slate-500">{card.back}</p>
              </div>
              <div className="flex items-center">
                 <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                   Learning
                 </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};