import React, { useState } from 'react';
import { Deck, Flashcard } from '../types';
import { Save, Plus, Trash2, ArrowLeft, X } from 'lucide-react';

interface DeckEditorProps {
  deck: Deck;
  onSave: (updatedDeck: Deck) => void;
  onCancel: () => void;
}

export const DeckEditor: React.FC<DeckEditorProps> = ({ deck, onSave, onCancel }) => {
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description);
  const [cards, setCards] = useState<Flashcard[]>(JSON.parse(JSON.stringify(deck.cards))); // Deep copy

  const handleCardChange = (id: string, field: 'front' | 'back', value: string) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addCard = () => {
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      front: '',
      back: '',
      mastered: false
    };
    setCards([...cards, newCard]);
  };

  const removeCard = (id: string) => {
    if (cards.length <= 1) {
      alert("A deck must have at least one card.");
      return;
    }
    setCards(cards.filter(c => c.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a deck title");
      return;
    }
    
    // Filter out completely empty cards
    const validCards = cards.filter(c => c.front.trim() || c.back.trim());
    if (validCards.length === 0) {
       alert("Please add at least one card with content");
       return;
    }

    onSave({
      ...deck,
      title,
      description,
      cards: validCards
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-slate-50/95 backdrop-blur py-4 border-b border-slate-200 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-slate-800">Edit Deck</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Deck Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-semibold text-lg text-slate-800"
              placeholder="e.g. Biology 101"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-600"
              placeholder="What is this deck about?"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {cards.map((card, index) => (
          <div key={card.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 relative">
            <div className="absolute top-4 left-4 text-xs font-bold text-slate-300">#{index + 1}</div>
            <button 
              onClick={() => removeCard(card.id)}
              className="absolute top-2 right-2 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="Delete Card"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Question (Front)</label>
                <textarea
                  value={card.front}
                  onChange={(e) => handleCardChange(card.id, 'front', e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none font-medium text-slate-800"
                  placeholder="Enter question..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-2">Answer (Back)</label>
                <textarea
                  value={card.back}
                  onChange={(e) => handleCardChange(card.id, 'back', e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-lg bg-indigo-50/50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none text-slate-800"
                  placeholder="Enter answer..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addCard}
        className="w-full mt-6 py-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-semibold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add New Card
      </button>
    </div>
  );
};