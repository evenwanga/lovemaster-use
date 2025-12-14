import React, { useState } from 'react';
import { Candidate, Matchmaker } from '../types';
import { ChevronLeft, MoreHorizontal, MapPin, Heart, Check, MessageSquare, Quote, X, Star, Ruler, GraduationCap, Briefcase } from 'lucide-react';

interface Props {
  candidate: Candidate;
  matchmaker: Matchmaker;
  isSelected: boolean;
  onBack: () => void;
  onToggleInterest: () => void;
  onConsult: () => void;
}

const CandidateDetail: React.FC<Props> = ({ 
  candidate, 
  matchmaker,
  isSelected, 
  onBack, 
  onToggleInterest,
  onConsult 
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const photos = candidate.photos && candidate.photos.length > 0 
    ? candidate.photos 
    : [candidate.avatar, 'https://picsum.photos/seed/extra1/500/800', 'https://picsum.photos/seed/extra2/500/800'];

  // Swipe handlers
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); 
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    }
    if (isRightSwipe && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
      
      {/* Immersive Scroll Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative bg-gray-50 pb-24">
         
         {/* 1. Full Screen-like Photo Area (75vh) */}
         <div className="relative h-[75vh] w-full bg-gray-200 overflow-hidden">
            {/* Top Navigation Overlay */}
            <div className="absolute top-0 left-0 right-0 z-50 p-3 pt-safe-top flex justify-between items-start pointer-events-none">
                <div 
                    onClick={onBack}
                    className="pointer-events-auto w-9 h-9 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
                >
                    <ChevronLeft size={24} />
                </div>
                <div 
                    className="pointer-events-auto w-9 h-9 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
                >
                    <MoreHorizontal size={20} />
                </div>
            </div>

            {/* Photo Carousel */}
            <div 
               className="flex h-full transition-transform duration-500 ease-out"
               style={{ transform: `translateX(-${currentPhotoIndex * 100}%)` }}
               onTouchStart={onTouchStart}
               onTouchMove={onTouchMove}
               onTouchEnd={onTouchEnd}
            >
               {photos.map((photo, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 relative">
                     <img 
                        src={photo} 
                        className="w-full h-full object-cover" 
                        alt={`Photo ${idx + 1}`} 
                     />
                     {/* Subtle dimming for better text contrast if needed */}
                     <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 pointer-events-none"></div>
                  </div>
               ))}
            </div>

            {/* Photo Indicators (Top center style like dating apps or Bottom) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 z-40 pt-safe-top">
                {photos.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1 rounded-full transition-all duration-300 shadow-sm ${idx === currentPhotoIndex ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`}
                    ></div>
                ))}
            </div>

            {/* Info Overlay (Over the image bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-5 pb-10 z-20 text-white select-none">
                <div className="flex items-center gap-2 mb-1">
                     <h1 className="text-3xl font-bold shadow-sm">{candidate.name}</h1>
                     {candidate.isLive && (
                        <div className="bg-pink-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            LIVE
                        </div>
                     )}
                     <div className="bg-green-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                        实名认证
                     </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm font-medium text-white/90 shadow-sm mb-3">
                    <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                        {candidate.age}岁
                    </span>
                    <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                        {candidate.zodiac}
                    </span>
                    <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                        <MapPin size={12} /> {candidate.hometown}
                    </span>
                </div>
            </div>
         </div>

         {/* 2. Scrollable Detail Sheet (Overlapping the photo slightly) */}
         <div className="relative -mt-6 rounded-t-3xl bg-white z-30 px-5 pt-8 min-h-[50vh]">
            {/* Heat Value Floating Badge */}
            <div className="absolute right-5 -top-8 bg-white p-1 rounded-full shadow-lg">
                <div className="bg-orange-50 rounded-full w-14 h-14 flex flex-col items-center justify-center border border-orange-100">
                    <span className="text-orange-500 font-extrabold text-sm">{candidate.heatValue || '99+'}</span>
                    <span className="text-[9px] text-orange-400">热度</span>
                </div>
            </div>

            {/* Basic Stats Grid */}
            <div className="grid grid-cols-4 gap-2 mb-6">
                 {[
                    { icon: Ruler, label: '身高', value: `${candidate.height}cm` },
                    { icon: Briefcase, label: '职业', value: candidate.job },
                    { icon: GraduationCap, label: '学历', value: candidate.education },
                    { icon: Star, label: '年薪', value: candidate.salary }
                 ].map((stat, i) => (
                     <div key={i} className="bg-gray-50 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                         <stat.icon size={16} className="text-gray-400 mb-1" />
                         <span className="text-[10px] text-gray-400 mb-0.5">{stat.label}</span>
                         <span className="text-xs font-bold text-gray-800 truncate w-full">{stat.value}</span>
                     </div>
                 ))}
            </div>

            {/* Tags */}
            <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-3 text-base">个人标签</h3>
                <div className="flex flex-wrap gap-2">
                    {candidate.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tag}
                        </span>
                    ))}
                    {candidate.activeTimeDesc && (
                        <span className="px-3 py-1.5 bg-green-50 text-green-600 text-xs rounded-full">
                            {candidate.activeTimeDesc}
                        </span>
                    )}
                </div>
            </div>

            {/* Intro Section */}
            <div className="mb-8">
                 <h3 className="font-bold text-gray-900 mb-3 text-base">关于我</h3>
                 <p className="text-sm text-gray-600 leading-7 text-justify">
                    {candidate.intro || '这个人很懒，什么都没有写...'}
                 </p>
            </div>

            {/* Requirements Section */}
            <div className="mb-8">
                 <h3 className="font-bold text-gray-900 mb-3 text-base">理想的TA</h3>
                 <div className="bg-pink-50/50 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed border border-pink-100/50 relative overflow-hidden">
                     <div className="absolute -right-4 -top-4 w-16 h-16 bg-pink-100 rounded-full opacity-50"></div>
                     {candidate.requirements || '希望对方真诚善良，有稳定的工作，愿意一起经营未来。'}
                 </div>
            </div>

            {/* Matchmaker Endorsement Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-white relative overflow-hidden mb-6 shadow-lg">
                 <Quote size={40} className="absolute top-2 right-4 text-white/10 rotate-180" />
                 
                 <div className="flex items-center gap-3 mb-3 relative z-10">
                     <img src={matchmaker.avatar} className="w-10 h-10 rounded-full border-2 border-white/20" alt="MM" />
                     <div>
                         <div className="font-bold text-sm">{matchmaker.name}</div>
                         <div className="text-[10px] text-gray-400">专属红娘 • 严选推荐</div>
                     </div>
                 </div>
                 
                 <p className="text-xs text-gray-300 italic relative z-10 leading-relaxed">
                    "{candidate.name} 真人比照片更有气质，性格也很好，资料已由我亲自核验，强烈推荐！"
                 </p>
            </div>
         </div>
      </div>

      {/* Bottom Floating Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-3 pb-safe-bottom flex items-center gap-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
         <div className="flex flex-col items-center gap-1 text-gray-400" onClick={onBack}>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
               <X size={20} />
            </div>
            <span className="text-[10px]">忽略</span>
         </div>
         
         <div className="flex-1 flex gap-3">
             <button 
                onClick={onToggleInterest}
                className={`flex-1 h-12 rounded-full font-bold text-sm flex items-center justify-center transition-all active:scale-95 border shadow-sm
                ${isSelected 
                    ? 'bg-gray-100 border-gray-200 text-gray-400' 
                    : 'bg-orange-50 border-orange-200 text-orange-600'}`}
             >
                 {isSelected ? (
                     <>
                       <Check size={18} className="mr-1.5" /> 已在心仪库
                     </>
                 ) : (
                     <>
                       <Heart size={18} className="mr-1.5" /> 加入心仪库
                     </>
                 )}
             </button>
             
             <button 
               onClick={onConsult}
               className="flex-1 h-12 rounded-full bg-mt-yellow text-gray-900 font-bold text-sm flex items-center justify-center shadow-md active:scale-95 hover:bg-yellow-400 transition-colors"
             >
                 <MessageSquare size={18} className="mr-1.5" /> 
                 立即咨询
             </button>
         </div>
      </div>
    </div>
  );
};

export default CandidateDetail;