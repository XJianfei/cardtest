import React, { useState, useEffect } from 'react';
import { Deck } from '../types';
import { CardFlip } from './CardFlip';
import { ArrowLeft, CheckCircle2, XCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyViewProps {
  deck: Deck;
  onExit: () => void;
  onUpdateDeck: (updatedDeck: Deck) => void;
}

export const StudyView: React.FC<StudyViewProps> = ({ deck, onExit, onUpdateDeck }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  // Track results by card ID to allow re-answering/navigation without double counting
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const currentCard = deck.cards[currentIndex];
  // Calculate progress based on current position
  const progress = ((currentIndex + 1) / deck.cards.length) * 100;

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults({});
    setIsSessionComplete(false);
  }, [deck.id]);

  // When session completes, update the deck mastery data
  useEffect(() => {
    if (isSessionComplete) {
      const updatedCards = deck.cards.map(card => {
        // Only update if the user actually answered this card in this session
        if (results[card.id] !== undefined) {
          return { ...card, mastered: results[card.id] };
        }
        return card;
      });
      
      onUpdateDeck({
        ...deck,
        cards: updatedCards
      });
    }
  }, [isSessionComplete]);

  const handleScore = (known: boolean) => {
    // Record result for this card
    setResults(prev => ({
      ...prev,
      [currentCard.id]: known
    }));

    // If it's the last card, finish session
    if (currentIndex >= deck.cards.length - 1) {
      const finalResults = { ...results, [currentCard.id]: known };
      const finalCorrectCount = Object.values(finalResults).filter(v => v).length;
      
      if (finalCorrectCount > deck.cards.length * 0.7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      setIsSessionComplete(true);
    } else {
      // Move to next
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    }
  };

  const handleNav = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    } else if (direction === 'next' && currentIndex < deck.cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults({});
    setIsSessionComplete(false);
  };

  if (isSessionComplete) {
    const correctCount = Object.values(results).filter(v => v).length;
    const incorrectCount = Object.values(results).filter(v => !v).length;
    
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] animate-fade-in px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Session Complete!</h2>
          <p className="text-slate-500 mb-8">Progress saved for "{deck.title}"</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              <div className="text-xs text-green-800 font-medium uppercase tracking-wide">Known</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="text-2xl font-bold text-orange-600">{incorrectCount}</div>
              <div className="text-xs text-orange-800 font-medium uppercase tracking-wide">Still Learning</div>
            </div>
          </div>

          <button 
            onClick={restart}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold mb-3 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Study Again
          </button>
          <button 
            onClick={onExit}
            className="w-full py-3 text-slate-500 font-medium hover:text-slate-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onExit}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h3 className="font-semibold text-slate-800">{deck.title}</h3>
          <p className="text-xs text-slate-400">{currentIndex + 1} of {deck.cards.length}</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Card Area with Desktop Nav */}
      <div className="flex-1 flex items-center justify-center min-h-[400px] relative w-full">
        {/* Previous Desktop */}
        <button 
          onClick={() => handleNav('prev')}
          disabled={currentIndex === 0}
          className="hidden md:flex absolute left-0 p-3 rounded-full bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-0 disabled:pointer-events-none transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="w-full max-w-lg px-2 sm:px-4">
          <CardFlip 
            front={currentCard.front}
            back={currentCard.back}
            isFlipped={isFlipped}
            onClick={() => setIsFlipped(!isFlipped)}
          />

          {/* Mobile Navigation controls */}
          <div className="md:hidden flex justify-between items-center mt-6 px-4 text-slate-400">
             <button 
               onClick={() => handleNav('prev')} 
               disabled={currentIndex === 0} 
               className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-30 transition-all"
             >
                 <ChevronLeft className="w-6 h-6" />
             </button>
             <span className="text-xs font-medium tracking-wide">
               {currentIndex + 1} / {deck.cards.length}
             </span>
             <button 
               onClick={() => handleNav('next')} 
               disabled={currentIndex === deck.cards.length - 1} 
               className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-30 transition-all"
             >
                 <ChevronRight className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Next Desktop */}
        <button 
          onClick={() => handleNav('next')}
          disabled={currentIndex === deck.cards.length - 1}
          className="hidden md:flex absolute right-0 p-3 rounded-full bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-0 disabled:pointer-events-none transition-all z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Grading Controls */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-8 max-w-md mx-auto w-full">
        <button
          onClick={() => handleScore(false)}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition-all group active:scale-95"
        >
          <XCircle className="w-6 h-6 mb-1 text-slate-400 group-hover:text-orange-500" />
          <span className="text-sm font-semibold text-slate-600 group-hover:text-orange-600">Still Learning</span>
        </button>
        <button
          onClick={() => handleScore(true)}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all group active:scale-95"
        >
          <CheckCircle2 className="w-6 h-6 mb-1 text-slate-400 group-hover:text-green-500" />
          <span className="text-sm font-semibold text-slate-600 group-hover:text-green-600">Got it</span>
        </button>
      </div>
    </div>
  );
};