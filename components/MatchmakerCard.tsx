import React from 'react';
import { Matchmaker } from '../types';
import { Star, ShieldCheck, Quote, Crown, Wallet, BadgeCheck, Building2, ChevronRight } from 'lucide-react';

interface Props {
  data: Matchmaker;
  onClick: () => void;
  onConsult: () => void;
  extraAction?: React.ReactNode;
}

const MatchmakerCard: React.FC<Props> = ({ data, onClick, onConsult, extraAction }) => {
  // Badge Logic: Prioritize Enterprise/Diamond
  const isEnterprise = data.badges.some(b => b.includes('企业') || b.includes('钻石'));
  const primaryBadge = data.badges.find(b => b.includes('企业') || b.includes('钻石')) || data.badges[0];
  const otherBadges = data.badges.filter(b => b !== primaryBadge);
  const showDeposit = data.badges.length > 0 && !!data.depositAmount;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm active:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-mt-yellow/50 relative overflow-hidden group"
    >
      <div className="flex gap-3">
        {/* Avatar Section */}
        <div className="relative w-20 h-20 flex-shrink-0">
           {data.isLive && (
             <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 animate-pulse opacity-70"></div>
           )}
           
          <img 
            src={data.avatar} 
            alt={data.name} 
            className={`w-full h-full object-cover rounded-lg border-2 relative z-10 ${data.isLive ? 'border-white' : 'border-gray-100'}`}
          />
          
          {data.isLive && (
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center whitespace-nowrap border-2 border-white shadow-sm z-20">
               <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-ping"></span>
               直播中
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0.5 flex-1 mr-2 min-w-0">
                  {/* Row 1: Name & Primary Badge */}
                  <div className="flex items-center flex-wrap gap-1.5">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight truncate max-w-full">{data.name}</h3>
                    {primaryBadge && (
                       <div className={`text-[9px] px-1 py-0.5 rounded flex items-center gap-0.5 font-bold shadow-sm whitespace-nowrap flex-shrink-0 ${
                           isEnterprise 
                             ? 'bg-gray-900 text-mt-yellow' // High contrast for Enterprise
                             : 'bg-gradient-to-r from-orange-50 to-amber-100 text-orange-700 border border-orange-200'
                       }`}>
                           {isEnterprise ? <Building2 size={9} /> : <Crown size={9} />}
                           {primaryBadge}
                       </div>
                    )}
                  </div>
                  
                  {/* Row 2: Stats */}
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-1 truncate">
                    <div className="flex items-center text-orange-500 font-bold flex-shrink-0">
                        <Star size={10} fill="currentColor" className="mr-0.5"/>
                        <span className="text-sm">{data.rating}</span>
                    </div>
                    <span className="w-px h-2 bg-gray-300 flex-shrink-0"></span>
                    <span className="flex-shrink-0">月单 {data.monthlyOrders}</span>
                    <span className="w-px h-2 bg-gray-300 flex-shrink-0"></span>
                    <span className="truncate">{data.distance}</span>
                    <span className="w-px h-2 bg-gray-300 flex-shrink-0"></span>
                    <span className="flex-shrink-0">{data.deliveryTime}响应</span>
                  </div>

                  {/* Row 3: Reputation (Deposit & Secondary Badges) */}
                  {(showDeposit || otherBadges.length > 0 || data.isVerified) && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {showDeposit && (
                              <div className="flex items-center gap-0.5 text-[9px] text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/60">
                                  <div className="bg-orange-100 p-0.5 rounded-sm">
                                    <Wallet size={8} className="text-orange-600" />
                                  </div>
                                  <span className="font-bold">保</span>
                                  ¥{(data.depositAmount || 0).toLocaleString()}
                              </div>
                          )}
                          
                          {otherBadges.slice(0, 2).map((badge, idx) => (
                               <div key={idx} className="flex items-center gap-0.5 text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                  <BadgeCheck size={9} className="text-gray-400" />
                                  {badge}
                               </div>
                          ))}
                          
                          {data.isVerified && !data.badges.includes('实名认证') && (
                              <div className="flex items-center gap-0.5 text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                 <ShieldCheck size={9} />
                                 实名
                             </div>
                          )}
                      </div>
                  )}
              </div>
              
              {/* Call to Action & Extra Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onConsult();
                    }}
                    className="bg-mt-yellow text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow active:scale-95 whitespace-nowrap"
                  >
                      去咨询
                  </button>
                  {extraAction}
              </div>
            </div>
        </div>
      </div>
      
      {/* "Matchmaker Says" Bubble - Personification */}
      <div className="mt-3 relative">
         <div className="bg-orange-50 rounded-lg p-3 border border-orange-100 text-xs text-gray-700 leading-relaxed flex gap-2 relative z-0">
            {/* Caret pointing to avatar (center of w-20 is 2.5rem = left-10) */}
            <div className="absolute -top-1.5 left-10 w-3 h-3 bg-orange-50 border-t border-l border-orange-100 rotate-45"></div>
            
            <Quote size={14} className="text-mt-yellow flex-shrink-0 mt-0.5 fill-current" />
            <div className="flex flex-col gap-0.5 relative z-10">
                <span className="text-[10px] text-orange-800 font-bold opacity-80">红娘寄语</span>
                <span className="line-clamp-2 italic text-gray-600">{data.intro}</span>
            </div>
         </div>
      </div>

      {/* Resource Carousel */}
      <div className="mt-3 pt-2 border-t border-dashed border-gray-100">
         <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <span className="w-1 h-3 bg-mt-yellow rounded-full"></span>
                精选嘉宾 ({data.candidates.length})
            </span>
            <span className="text-[10px] text-gray-400 flex items-center group/more hover:text-gray-600 transition-colors">
                查看全部 <ChevronRight size={10} className="ml-0.5 transition-transform group-hover/more:translate-x-0.5" />
            </span>
         </div>
         
         <div className="relative">
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 pr-8">
                {data.candidates.slice(0, 6).map(c => (
                  <div key={c.id} className="flex-shrink-0 w-14 flex flex-col items-center gap-1 group/item cursor-pointer">
                    <div className="relative w-12 h-12">
                        <img 
                            src={c.avatar} 
                            className={`w-full h-full rounded-full object-cover border-2 transition-transform group-hover/item:scale-105 ${c.isLive ? 'border-pink-500' : 'border-white shadow-sm'}`} 
                            alt={c.name} 
                        />
                        {c.isLive && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[8px] px-1 rounded-[4px] leading-tight scale-75 whitespace-nowrap z-10">
                                LIVE
                            </div>
                        )}
                    </div>
                    <span className="text-[10px] text-gray-600 truncate w-full text-center bg-gray-50 px-1 rounded-sm mt-1">
                        {c.job}
                    </span>
                  </div>
                ))}
            </div>
            
            {/* Scroll Indicator: Gradient Fade + Subtle Arrow */}
            <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none flex items-center justify-end pr-1 rounded-r-xl">
                 <ChevronRight size={16} className="text-gray-400/50 animate-pulse" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default MatchmakerCard;