import React from 'react';
import { Candidate } from '../types';
import { Plus, Video, Flame, Clock, Check } from 'lucide-react';

interface Props {
  candidate: Candidate;
  isSelected: boolean;
  onToggle: () => void;
  onClick?: () => void;
}

const CandidateItem: React.FC<Props> = ({ candidate, isSelected, onToggle, onClick }) => {
  return (
    <div 
      className="flex gap-3 mb-6 relative active:opacity-80 transition-opacity cursor-pointer"
      onClick={onClick}
    >
      <div className="w-24 h-24 flex-shrink-0 relative">
        <img 
          src={candidate.avatar} 
          alt={candidate.name} 
          className="w-full h-full object-cover rounded-lg"
        />
        
        {/* Live Status Overlay */}
        {candidate.isLive && (
          <div className="absolute top-1 left-1 bg-black/50 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/20">
             <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></div>
             直播中
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex justify-between items-start mb-1">
              <h4 className="text-base font-bold text-gray-900 leading-tight flex items-center gap-1">
                  {candidate.name}
              </h4>
              {candidate.activeTimeDesc && (
                 <div className="flex items-center text-[10px] text-gray-400">
                     <Clock size={10} className="mr-0.5"/>
                     {candidate.activeTimeDesc}
                 </div>
              )}
          </div>

          <p className="text-xs text-gray-500 mb-1 line-clamp-1">
            {candidate.age}岁 • {candidate.height}cm • {candidate.education}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-1.5">
             <span className="text-[10px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded">{candidate.job}</span>
             <span className="text-[10px] bg-red-50 text-red-600 px-1 py-0.5 rounded">¥{candidate.salary}</span>
          </div>
          
          {/* Heat & Tags Row */}
          <div className="flex items-center gap-2 mb-1">
              {candidate.heatValue && (
                 <div className="flex items-center text-[10px] text-orange-600 bg-orange-50 px-1 py-0.5 rounded font-bold">
                    <Flame size={10} className="mr-0.5 fill-orange-500" />
                    {candidate.heatValue}
                 </div>
              )}
              <div className="flex gap-1 overflow-hidden">
                {candidate.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-[10px] text-gray-500 border border-gray-200 px-1 py-0.5 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
          </div>
        </div>
        
        {/* Price/Action Area */}
        <div className="flex items-center justify-between mt-1">
          <div className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded flex items-center">
             <Check size={10} className="mr-0.5"/> 实名认证
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`
                h-7 px-3 rounded-full flex items-center justify-center text-xs font-bold transition-all active:scale-95 shadow-sm
                ${isSelected 
                    ? 'bg-gray-100 text-gray-500 border border-gray-200' 
                    : 'bg-mt-yellow text-gray-900 border border-mt-yellow'}
            `}
          >
            {isSelected ? (
                <>
                  <Check size={14} className="mr-1" /> 已选
                </>
            ) : (
                <>
                  <Plus size={14} className="mr-1" strokeWidth={2.5} /> 感兴趣
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateItem;