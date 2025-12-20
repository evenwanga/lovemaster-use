import React, { useState } from 'react';
import { ChevronLeft, Crown, Gem, Star, ShieldCheck, Zap, Gift, Check, CreditCard, Sparkles, ChevronRight } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const BlackCard: React.FC<Props> = ({ onBack }) => {
  const [selectedPkg, setSelectedPkg] = useState(2); // Default to recommended

  const packages = [
    { id: 1, price: 2999, value: 3500, label: '体验黑卡', tag: '入门' },
    { id: 2, price: 9999, value: 12000, label: '贵宾黑卡', tag: '超值', recommended: true },
    { id: 3, price: 29999, value: 38000, label: '至尊黑卡', tag: '尊享' },
  ];

  const benefits = [
    { icon: Crown, title: '身份标识', desc: '全站尊贵黑金标识' },
    { icon: Gem, title: 'S级资源', desc: '优先匹配顶级嘉宾' },
    { icon: Star, title: '专属客服', desc: '7x24小时1对1服务' },
    { icon: ShieldCheck, title: '双倍赔付', desc: '约会不满意双倍赔' },
    { icon: Zap, title: '极速响应', desc: '红娘消息秒级回复' },
    { icon: Gift, title: '生日礼遇', desc: '专属生日惊喜礼包' },
  ];

  const notices = [
      "张先生 (138****8821) 刚刚开通了贵宾黑卡",
      "李女士 (186****1234) 刚刚开通了体验黑卡",
      "王先生 (139****9988) 刚刚开通了至尊黑卡"
  ];

  return (
    <div className="h-screen bg-slate-900 flex flex-col relative overflow-hidden text-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 px-4 py-3 flex items-center justify-between pt-safe-top">
        <ChevronLeft size={24} className="text-white/80 cursor-pointer" onClick={onBack} />
        <span className="font-bold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200">幸福黑卡</span>
        <div className="w-6"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto pb-32 relative z-10 no-scrollbar">
        {/* Card Visual */}
        <div className="px-6 pt-4 pb-8 perspective-1000">
          <div className="w-full aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black border border-yellow-500/30 relative overflow-hidden shadow-2xl group transform transition-transform hover:scale-[1.02] duration-500">
            {/* Glossy Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
            
            {/* Card Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-lg">
                      <Crown size={16} className="text-black fill-black/20" />
                   </div>
                   <span className="font-serif italic text-yellow-500 font-bold text-lg">XINGFU BLACK</span>
                </div>
                <div className="text-[10px] text-yellow-500/60 font-mono tracking-widest">PREMIUM MEMBER</div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                     <div className="w-10 h-7 bg-yellow-600/20 rounded border border-yellow-600/40 flex items-center justify-center">
                        <div className="w-6 h-4 border border-yellow-500/50 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                            <div className="bg-yellow-500/50 rounded-[1px]"></div>
                            <div className="border border-yellow-500/30 rounded-[1px]"></div>
                        </div>
                     </div>
                     <Sparkles size={20} className="text-yellow-200 animate-pulse" />
                 </div>
                 <div className="font-mono text-xl text-yellow-100/90 tracking-widest shadow-black drop-shadow-md">
                    8888 8888 8888 8888
                 </div>
              </div>
              
              <div className="flex justify-between items-end text-yellow-500/80 text-xs">
                 <div className="flex flex-col">
                    <span className="text-[8px] uppercase opacity-50 mb-0.5">Card Holder</span>
                    <span className="font-bold tracking-wide">WEIXIN USER</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[8px] uppercase opacity-50 mb-0.5">Valid Thru</span>
                    <span className="font-bold">PERMANENT</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee Notice */}
        <div className="mx-4 mb-6 bg-slate-800/50 rounded-full px-4 py-2 flex items-center gap-2 border border-white/5 backdrop-blur-sm overflow-hidden">
             <div className="bg-yellow-500/20 p-1 rounded-full">
                <Gift size={12} className="text-yellow-400" />
             </div>
             <div className="flex-1 overflow-hidden h-4 relative">
                <div className="animate-[slideUp_9s_infinite_steps(3)]">
                   {notices.map((notice, i) => (
                       <div key={i} className="text-xs text-slate-300 h-4 flex items-center truncate">{notice}</div>
                   ))}
                   {/* Duplicate first for smooth loop if needed, using simplified css steps for now */}
                </div>
             </div>
        </div>

        {/* Benefits Grid */}
        <div className="px-4 mb-8">
           <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full"></span>
              黑卡尊享权益
           </h2>
           <div className="grid grid-cols-3 gap-3">
              {benefits.map((b, i) => (
                  <div key={i} className="bg-slate-800/50 border border-white/5 rounded-xl p-3 flex flex-col items-center text-center backdrop-blur-sm hover:bg-slate-800 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-slate-900 border border-yellow-500/20 flex items-center justify-center mb-2 shadow-inner">
                          <b.icon size={20} className="text-yellow-500" />
                      </div>
                      <div className="text-sm font-bold text-slate-200 mb-0.5">{b.title}</div>
                      <div className="text-[10px] text-slate-500">{b.desc}</div>
                  </div>
              ))}
           </div>
        </div>

        {/* Packages - Horizontal Grid */}
        <div className="px-4 mb-8">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full"></span>
              充值套餐
           </h2>
           <div className="grid grid-cols-3 gap-3">
               {packages.map((pkg) => {
                   const isSelected = selectedPkg === pkg.id;
                   return (
                       <div 
                         key={pkg.id} 
                         onClick={() => setSelectedPkg(pkg.id)}
                         className={`
                            relative rounded-xl p-[1px] transition-all cursor-pointer group
                            ${isSelected 
                                ? 'bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-lg shadow-yellow-900/40 translate-y-[-2px]' 
                                : 'bg-slate-700 hover:bg-slate-600 border border-white/5'}
                         `}
                       >
                           {/* Recommended Badge */}
                           {pkg.recommended && (
                               <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold shadow-sm z-20 whitespace-nowrap border border-white/10 scale-90">
                                   超值推荐
                               </div>
                           )}

                           <div className={`h-full rounded-[10px] py-3 px-1 flex flex-col items-center justify-between text-center ${isSelected ? 'bg-slate-800' : 'bg-slate-800/60'}`}>
                               
                               <div className="space-y-1 w-full">
                                   <div className={`text-sm font-bold truncate ${isSelected ? 'text-yellow-400' : 'text-slate-200'}`}>{pkg.label}</div>
                                   <div className={`text-[9px] border px-1 rounded inline-block ${isSelected ? 'border-yellow-600/50 text-yellow-600' : 'border-slate-600 text-slate-500'}`}>
                                       {pkg.tag}
                                   </div>
                               </div>

                               <div className="my-2">
                                   <div className="text-base font-bold text-white font-mono leading-none">
                                       <span className="text-[10px] align-top mr-0.5">¥</span>{pkg.price.toLocaleString()}
                                   </div>
                                   <div className="text-[9px] text-slate-500 line-through mt-0.5 scale-90">¥{pkg.value.toLocaleString()}</div>
                               </div>

                               <div className="text-[9px] text-yellow-600 bg-yellow-400/10 px-1 py-0.5 rounded w-full truncate">
                                   赠¥{(pkg.value - pkg.price).toLocaleString()}
                               </div>
                           </div>
                       </div>
                   )
               })}
           </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 text-center text-[10px] text-slate-600 leading-relaxed pb-8">
            <p>点击“立即开通”即代表您已同意《黑卡会员服务协议》</p>
            <p>会员权益最终解释权归平台所有</p>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-white/5 px-4 py-3 pb-safe-bottom z-50">
           <div className="flex items-center gap-4">
               <div className="flex-1">
                   <div className="text-xs text-slate-400">实付金额</div>
                   <div className="text-2xl font-bold text-yellow-500 font-mono">
                       ¥{packages.find(p => p.id === selectedPkg)?.price.toLocaleString()}
                   </div>
               </div>
               <button 
                  onClick={() => alert('调起支付组件...')}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-8 py-3 rounded-full shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform flex items-center gap-2"
               >
                   立即开通 <ChevronRight size={16} />
               </button>
           </div>
      </div>
    </div>
  );
};

export default BlackCard;