import React from 'react';
import { Candidate, Matchmaker } from '../types';
import { ShieldCheck, MessageSquare, CheckCircle2, Flame } from 'lucide-react';

interface Props {
  candidate: Candidate;
  matchmaker: Matchmaker;
  onClick: () => void;
  onConsult: () => void;
}

const SearchResultItem: React.FC<Props> = ({ candidate, matchmaker, onClick, onConsult }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-3 mb-3 flex flex-col gap-3 shadow-sm active:bg-gray-50 transition-colors"
    >
      {/* Top Section: Candidate (Resource) Info */}
      <div className="flex gap-3">
        {/* Left: Image */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <img 
            src={candidate.avatar} 
            alt={candidate.name} 
            className="w-full h-full object-cover rounded-lg border border-gray-100"
          />
          {/* Rank Badge overlay */}
          {candidate.heatValue && candidate.heatValue > 9000 && (
             <div className="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-tl-lg rounded-br-lg font-bold">
               高热度资源
             </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
                {/* Title Line */}
                <div className="flex items-start gap-1 mb-1">
                    <span className="flex-shrink-0 bg-red-500 text-white text-[10px] px-1 rounded-[3px] h-4 flex items-center justify-center font-bold mt-0.5">
                        严选
                    </span>
                    <span className="flex-shrink-0 bg-mt-yellow text-black text-[10px] px-1 rounded-[3px] h-4 flex items-center justify-center font-bold mt-0.5">
                        秒答
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                        {candidate.name} {candidate.job} {candidate.height}cm {candidate.education} {candidate.intro}
                    </h3>
                </div>

                {/* Tags/Attributes */}
                <div className="text-[10px] text-gray-500 mb-1 truncate">
                    {candidate.age}岁 | {candidate.hometown} | {candidate.zodiac}
                </div>

                {/* Tags row */}
                <div className="flex gap-1 mb-2">
                    <span className="text-[9px] text-gray-500 border border-gray-200 px-1 rounded bg-gray-50">
                        资料已核验
                    </span>
                    <span className="text-[9px] text-gray-500 border border-gray-200 px-1 rounded bg-gray-50">
                        本人在本地
                    </span>
                </div>
            </div>

            {/* Action Area (No Price) */}
            <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1 text-[10px] text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                   <Flame size={10} className="fill-orange-600" />
                   <span>红娘有匹配资源</span>
                </div>
                
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onConsult();
                    }}
                    className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm active:scale-95 flex items-center gap-1"
                >
                    <MessageSquare size={12} className="fill-white" />
                    立即咨询
                </button>
            </div>
        </div>
      </div>

      {/* Bottom Section: Merchant Info */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2 max-w-[65%]">
              <div className="flex items-center gap-1 text-[10px] text-blue-500 bg-blue-50 px-1 py-0.5 rounded border border-blue-100 flex-shrink-0">
                  <ShieldCheck size={10} />
                  <span>平台认证</span>
              </div>
              <span className="text-xs text-gray-600 truncate font-medium">{matchmaker.name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-gray-400 flex-shrink-0">
              <span className="bg-green-50 text-green-700 px-1 rounded border border-green-100">
                  在线
              </span>
              <span>{matchmaker.deliveryTime}回复</span>
              <span>{matchmaker.distance}</span>
          </div>
      </div>
    </div>
  );
};

export default SearchResultItem;