import React, { useState } from 'react';
import { ChevronLeft, Trash2, Clock, Search } from 'lucide-react';
import { Matchmaker, Candidate } from '../types';
import { MOCK_MATCHMAKERS } from '../constants';
import SearchResultItem from './SearchResultItem';

interface Props {
  onBack: () => void;
  onNavigateToCandidate: (candidate: Candidate, matchmaker: Matchmaker) => void;
  onConsult: (matchmaker: Matchmaker, candidate: Candidate) => void;
}

// Helper to flatten data for the mock history view
// In a real app, this would come from a user history state/context
const getMockHistory = () => {
    const historyItems: { candidate: Candidate; matchmaker: Matchmaker; time: string }[] = [];
    
    // Pick specific candidates to simulate history
    if (MOCK_MATCHMAKERS[0] && MOCK_MATCHMAKERS[0].candidates[1]) {
        historyItems.push({
            matchmaker: MOCK_MATCHMAKERS[0],
            candidate: MOCK_MATCHMAKERS[0].candidates[1], // 陈婷
            time: '刚刚'
        });
    }
    
    if (MOCK_MATCHMAKERS[1] && MOCK_MATCHMAKERS[1].candidates[0]) {
        historyItems.push({
            matchmaker: MOCK_MATCHMAKERS[1],
            candidate: MOCK_MATCHMAKERS[1].candidates[0], // 刘强
            time: '10分钟前'
        });
    }

    if (MOCK_MATCHMAKERS[0] && MOCK_MATCHMAKERS[0].candidates[3]) {
        historyItems.push({
            matchmaker: MOCK_MATCHMAKERS[0],
            candidate: MOCK_MATCHMAKERS[0].candidates[3], // 吴倩
            time: '1小时前'
        });
    }

    if (MOCK_MATCHMAKERS[2] && MOCK_MATCHMAKERS[2].candidates[0]) {
        historyItems.push({
            matchmaker: MOCK_MATCHMAKERS[2],
            candidate: MOCK_MATCHMAKERS[2].candidates[0], // 王磊
            time: '昨天'
        });
    }

    return historyItems;
};

const History: React.FC<Props> = ({ onBack, onNavigateToCandidate, onConsult }) => {
  const [historyList, setHistoryList] = useState(getMockHistory());

  const handleClear = () => {
      if (window.confirm('确定要清空所有浏览记录吗？')) {
          setHistoryList([]);
      }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10 pt-safe-top">
        <ChevronLeft size={24} className="text-gray-700 cursor-pointer" onClick={onBack} />
        <span className="font-bold text-lg text-gray-900">最近浏览</span>
        <button onClick={handleClear} disabled={historyList.length === 0}>
            <Trash2 size={20} className={`${historyList.length === 0 ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
          <div className="text-xs text-gray-400 mb-3 px-1 flex justify-between items-center">
              <span>共 {historyList.length} 条浏览记录</span>
              <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                  仅保留最近30天
              </span>
          </div>

          {historyList.length > 0 ? (
              <div className="space-y-3 pb-20">
                  {historyList.map((item, index) => (
                      <div key={`${item.candidate.id}-${index}`}>
                          {/* Time label overlay or header could be added here */}
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1 ml-1">
                                <Clock size={10} />
                                <span>{item.time}看过</span>
                          </div>
                          <SearchResultItem 
                              candidate={item.candidate}
                              matchmaker={item.matchmaker}
                              onClick={() => onNavigateToCandidate(item.candidate, item.matchmaker)}
                              onConsult={() => onConsult(item.matchmaker, item.candidate)}
                          />
                      </div>
                  ))}
                  
                  <div className="text-center py-6 text-gray-300 text-xs">
                      — 您看得很仔细，继续逛逛吧 —
                  </div>
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center pt-24 text-gray-400">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Search size={32} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-gray-500">暂无浏览记录</p>
                  <p className="text-xs text-gray-400 mt-1">去首页看看有没有心仪的嘉宾吧</p>
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

export default History;