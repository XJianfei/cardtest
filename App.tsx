import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid, BrainCircuit, Github, Trash2, Play, Pencil, BarChart3, PieChart } from 'lucide-react';
import { Deck, AppView } from './types';
import { DeckCreator } from './components/DeckCreator';
import { DeckEditor } from './components/DeckEditor';
import { StudyView } from './components/StudyView';
import { DeckStats } from './components/DeckStats';
import { GlobalStats } from './components/GlobalStats';

// Sample initial data
const INITIAL_DECKS: Deck[] = [
  {
    id: '1',
    title: 'JavaScript Basics',
    description: 'Core concepts of JS programming',
    cards: [
      { id: '1a', front: 'What is a closure?', back: 'A function bundled with its lexical environment.', mastered: false },
      { id: '1b', front: 'What is hoisting?', back: 'Variable and function declarations are moved to the top of their scope.', mastered: false },
    ],
    createdAt: Date.now(),
    themeColor: 'indigo',
    icon: 'code'
  }
];

export default function App() {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [decks, setDecks] = useState<Deck[]>(() => {
    const saved = localStorage.getItem('flashmind-decks');
    return saved ? JSON.parse(saved) : INITIAL_DECKS;
  });
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('flashmind-decks', JSON.stringify(decks));
  }, [decks]);

  const handleCreateDeck = (newDeck: Deck) => {
    setDecks([newDeck, ...decks]);
    // Always allow editing immediately after creation so user can review AI cards
    setActiveDeckId(newDeck.id);
    setView(AppView.EDIT_DECK);
  };

  const handleDeleteDeck = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this deck?')) {
      setDecks(decks.filter(d => d.id !== id));
    }
  };

  const handleEditDeck = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveDeckId(id);
    setView(AppView.EDIT_DECK);
  };

  const handleViewStats = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveDeckId(id);
    setView(AppView.DECK_STATS);
  };

  const handleSaveDeck = (updatedDeck: Deck) => {
    setDecks(decks.map(d => d.id === updatedDeck.id ? updatedDeck : d));
    setView(AppView.DASHBOARD);
  };

  const handleUpdateDeckStudyProgress = (updatedDeck: Deck) => {
    setDecks(decks.map(d => d.id === updatedDeck.id ? updatedDeck : d));
  };

  const startStudy = (deckId: string) => {
    setActiveDeckId(deckId);
    setView(AppView.STUDY_SESSION);
  };

  const activeDeck = decks.find(d => d.id === activeDeckId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView(AppView.DASHBOARD)}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <BrainCircuit className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">
              FlashMind<span className="text-indigo-600">.ai</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {view === AppView.DASHBOARD && (
              <>
                 <button 
                  onClick={() => setView(AppView.GLOBAL_STATS)}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Overall Progress"
                 >
                   <PieChart className="w-5 h-5" />
                 </button>
                 <div className="w-px h-6 bg-slate-200 mx-1"></div>
                 <button 
                   onClick={() => setView(AppView.CREATE_DECK)}
                   className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-md"
                 >
                   <Plus className="w-4 h-4" />
                   New Deck
                 </button>
              </>
            )}
            <a href="#" className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        
        {/* DASHBOARD VIEW */}
        {view === AppView.DASHBOARD && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Your Decks</h2>
                <p className="text-slate-500 text-sm mt-1">Select a deck to start studying or edit to customize</p>
              </div>
              
              {/* Mobile FAB */}
              <button 
                onClick={() => setView(AppView.CREATE_DECK)}
                className="sm:hidden w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-300 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            {decks.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <BrainCircuit className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">No decks yet</h3>
                <p className="text-slate-400 mb-6 max-w-xs mx-auto">Create your first AI-powered flashcard deck or write your own.</p>
                <button 
                  onClick={() => setView(AppView.CREATE_DECK)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  Create Deck
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create New Card (Desktop Grid) */}
                <div 
                  onClick={() => setView(AppView.CREATE_DECK)}
                  className="hidden sm:flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-indigo-300 cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 text-indigo-500" />
                  </div>
                  <span className="font-medium text-slate-600">Create New Deck</span>
                </div>

                {/* Deck Cards */}
                {decks.map(deck => {
                  const masteredCount = deck.cards.filter(c => c.mastered).length;
                  const progress = deck.cards.length > 0 ? (masteredCount / deck.cards.length) * 100 : 0;
                  
                  return (
                    <div 
                      key={deck.id}
                      onClick={() => startStudy(deck.id)}
                      className="group relative bg-white h-48 rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                        <button 
                          onClick={(e) => handleViewStats(e, deck.id)}
                          className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-200 hover:text-slate-700 shadow-sm"
                          title="View Statistics"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                         <button 
                          onClick={(e) => handleEditDeck(e, deck.id)}
                          className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-200 hover:text-slate-700 shadow-sm"
                          title="Edit Deck"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteDeck(e, deck.id)}
                          className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 shadow-sm"
                          title="Delete Deck"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div>
                        <div className={`w-10 h-10 rounded-lg bg-${deck.themeColor || 'indigo'}-50 flex items-center justify-center mb-4 text-${deck.themeColor || 'indigo'}-600`}>
                          <LayoutGrid className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1 line-clamp-1">{deck.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2">{deck.description}</p>
                      </div>
                      
                      <div>
                        {/* Mini Progress Bar */}
                        <div className="w-full h-1 bg-slate-100 rounded-full mb-3 overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md">
                            {deck.cards.length} cards
                          </span>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Play className="w-4 h-4 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CREATE VIEW */}
        {view === AppView.CREATE_DECK && (
          <DeckCreator 
            onDeckCreated={handleCreateDeck}
            onCancel={() => setView(AppView.DASHBOARD)}
          />
        )}

        {/* EDIT VIEW */}
        {view === AppView.EDIT_DECK && activeDeck && (
          <DeckEditor
            deck={activeDeck}
            onSave={handleSaveDeck}
            onCancel={() => setView(AppView.DASHBOARD)}
          />
        )}

        {/* STATS VIEW */}
        {view === AppView.DECK_STATS && activeDeck && (
          <DeckStats
            deck={activeDeck}
            onBack={() => setView(AppView.DASHBOARD)}
            onEdit={() => setView(AppView.EDIT_DECK)}
          />
        )}
        
        {/* GLOBAL STATS VIEW */}
        {view === AppView.GLOBAL_STATS && (
          <GlobalStats
            decks={decks}
            onBack={() => setView(AppView.DASHBOARD)}
          />
        )}

        {/* STUDY VIEW */}
        {view === AppView.STUDY_SESSION && activeDeck && (
          <StudyView 
            deck={activeDeck}
            onExit={() => setView(AppView.DASHBOARD)}
            onUpdateDeck={handleUpdateDeckStudyProgress}
            onEdit={() => setView(AppView.EDIT_DECK)}
          />
        )}
      </main>
    </div>
  );
}