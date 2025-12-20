import React, { useState } from 'react';
import { ChevronLeft, Search, Heart, MessageSquare, Trash2 } from 'lucide-react';
import { Matchmaker } from '../types';
import { MOCK_MATCHMAKERS } from '../constants';
import MatchmakerCard from './MatchmakerCard';

interface Props {
  onBack: () => void;
  onNavigateToMatchmaker: (m: Matchmaker) => void;
  onConsult: (m: Matchmaker) => void;
}

const FavoriteMatchmakers: React.FC<Props> = ({ onBack, onNavigateToMatchmaker, onConsult }) => {
  // Mock initial state: assume user liked the first two matchmakers for demo purposes
  const [favorites, setFavorites] = useState<string[]>([MOCK_MATCHMAKERS[0].id, MOCK_MATCHMAKERS[1].id]);
  const [searchTerm, setSearchTerm] = useState('');

  const favoriteList = MOCK_MATCHMAKERS.filter(m => favorites.includes(m.id))
    .filter(m => m.name.includes(searchTerm) || m.tags.some(t => t.label.includes(searchTerm)));

  const handleUnfavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // In a real app, this would call an API
    if (window.confirm('确定要取消收藏该红娘吗？')) {
        setFavorites(prev => prev.filter(fid => fid !== id));
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10 pt-safe-top">
        <ChevronLeft size={24} className="text-gray-700 cursor-pointer" onClick={onBack} />
        <span className="font-bold text-lg text-gray-900">收藏红娘</span>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Search Filter */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 sticky top-[calc(44px+env(safe-area-inset-top))] z-10">
          <div className="bg-gray-100 rounded-full flex items-center px-4 py-2 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-mt-yellow/50">
              <Search size={16} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="搜索已收藏的红娘或标签" 
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400 text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
          <div className="text-xs text-gray-400 mb-3 px-1 flex justify-between items-center">
              <span>共收藏 {favoriteList.length} 位红娘</span>
              {favorites.length > 0 && (
                  <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-500">长按可管理</span>
              )}
          </div>

          {favoriteList.length > 0 ? (
              <div className="space-y-3 pb-20">
                  {favoriteList.map(item => (
                      <div key={item.id} className="relative group">
                          {/* Reuse standard card with extraAction for the heart button */}
                          <MatchmakerCard 
                              data={item} 
                              onClick={() => onNavigateToMatchmaker(item)} 
                              onConsult={() => onConsult(item)} 
                              extraAction={
                                  <button 
                                    onClick={(e) => handleUnfavorite(e, item.id)}
                                    className="bg-red-50 p-1.5 rounded-full shadow-sm text-red-500 border border-red-100 active:scale-90 transition-transform flex items-center justify-center w-7 h-7"
                                    aria-label="取消收藏"
                                  >
                                     <Heart size={14} fill="currentColor" />
                                  </button>
                              }
                          />
                      </div>
                  ))}
                  
                  <div className="text-center py-6 text-gray-300 text-xs">
                      — 没有更多了 —
                  </div>
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Heart size={32} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-gray-500">暂无收藏的红娘</p>
                  <p className="text-xs text-gray-400 mt-1">遇到优秀的红娘记得点亮爱心哦</p>
                  <button 
                    onClick={onBack} 
                    className="mt-6 px-8 py-2.5 bg-mt-yellow text-gray-900 rounded-full font-bold text-sm shadow-sm active:scale-95 transition-transform"
                  >
                      去首页逛逛
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};

export default FavoriteMatchmakers;