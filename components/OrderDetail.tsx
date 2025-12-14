import React from 'react';
import { Order, ServiceRecord } from '../types';
import { ChevronLeft, MoreHorizontal, ShoppingBag, Clock, MapPin, MessageSquare, CheckCircle2, Circle, Heart, Plus, Calendar, ChevronRight } from 'lucide-react';

interface Props {
  order: Order;
  onBack: () => void;
}

const OrderDetail: React.FC<Props> = ({ order, onBack }) => {
  // Split records by status
  const activeRecords = order.records.filter(r => r.status === 'planning' || r.status === 'confirmed');
  const unusedRecords = order.records.filter(r => r.status === 'unused');
  const completedRecords = order.records.filter(r => r.status === 'completed');

  const renderActiveRecord = (record: ServiceRecord) => (
    <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-[10px] px-2 py-1 rounded-bl-lg font-bold">
            进行中
        </div>
        
        <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
            <h3 className="font-bold text-gray-900">约会策划中</h3>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-6 px-2">
            {[
                { step: 1, label: '选人' },
                { step: 2, label: '确认' },
                { step: 3, label: '见面' },
                { step: 4, label: '反馈' }
            ].map((s, idx, arr) => {
                const isActive = (record.step || 0) >= s.step;
                const isCurrent = (record.step || 0) === s.step;
                return (
                    <div key={s.step} className="flex flex-col items-center relative z-10 flex-1">
                        {/* Connecting Line */}
                        {idx < arr.length - 1 && (
                            <div className={`absolute top-2.5 left-1/2 w-full h-0.5 -z-10 ${isActive && (record.step || 0) > s.step ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                        )}
                        
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 transition-colors ${isActive ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-300 text-gray-400'} ${isCurrent ? 'ring-2 ring-orange-200' : ''}`}>
                            {isActive ? <CheckCircle2 size={12} /> : s.step}
                        </div>
                        <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-orange-600' : 'text-gray-400'}`}>{s.label}</span>
                    </div>
                );
            })}
        </div>

        {/* Current State Info */}
        <div className="bg-orange-50/50 rounded-lg p-3 flex gap-3">
             {record.candidate ? (
                 <img src={record.candidate.avatar} className="w-12 h-12 rounded-full border border-white shadow-sm object-cover" />
             ) : (
                 <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                     <Heart size={20} className="text-gray-400" />
                 </div>
             )}
             
             <div className="flex-1 min-w-0">
                 {record.candidate ? (
                     <>
                        <div className="font-bold text-gray-900 text-sm mb-1">{record.candidate.name} <span className="text-gray-400 font-normal">| 约会对象</span></div>
                        <div className="flex flex-col gap-1 text-xs text-gray-600">
                             {record.date && (
                                 <div className="flex items-center gap-1">
                                     <Calendar size={12} className="text-orange-400" />
                                     <span>{record.date}</span>
                                 </div>
                             )}
                             {record.location && (
                                 <div className="flex items-center gap-1">
                                     <MapPin size={12} className="text-orange-400" />
                                     <span>{record.location}</span>
                                 </div>
                             )}
                        </div>
                     </>
                 ) : (
                     <div className="h-full flex items-center text-gray-500 text-xs">
                         正在为您匹配合适的嘉宾...
                     </div>
                 )}
             </div>
        </div>
        
        <div className="flex gap-2 mt-4">
            <button className="flex-1 bg-white border border-gray-200 py-2 rounded-full text-xs font-bold text-gray-700">修改计划</button>
            <button className="flex-1 bg-mt-yellow py-2 rounded-full text-xs font-bold text-gray-900 shadow-sm">联系红娘</button>
        </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
       {/* Header */}
       <div className="bg-white px-3 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10">
           <ChevronLeft size={24} className="text-gray-700 cursor-pointer" onClick={onBack} />
           <span className="font-bold text-gray-900">服务详情</span>
           <MoreHorizontal size={24} className="text-gray-700" />
       </div>

       <div className="flex-1 overflow-y-auto p-4 pb-20">
           {/* Order Summary Card */}
           <div className="bg-white rounded-xl p-4 mb-4 shadow-sm flex gap-3">
               <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                   <ShoppingBag size={24} />
               </div>
               <div className="flex-1 min-w-0">
                   <h2 className="font-bold text-gray-900 text-sm mb-1">{order.serviceTitle}</h2>
                   <div className="text-xs text-gray-500 mb-2">订单号: {order.id}2938472</div>
                   <div className="flex items-center gap-4 text-xs">
                       <div>
                           <span className="text-gray-500">总次数</span>
                           <span className="ml-1 font-bold text-gray-900">{order.count}</span>
                       </div>
                       <div>
                           <span className="text-gray-500">剩余</span>
                           <span className="ml-1 font-bold text-orange-500">{order.count - order.usedCount}</span>
                       </div>
                   </div>
               </div>
           </div>

           {/* 1. Active Missions (Priority) */}
           {activeRecords.length > 0 && (
               <div className="mb-6">
                   <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                       正在进行 <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded-full">{activeRecords.length}</span>
                   </h3>
                   {activeRecords.map(renderActiveRecord)}
               </div>
           )}

           {/* 2. Unused Equities */}
           {unusedRecords.length > 0 && (
               <div className="mb-6">
                   <h3 className="font-bold text-gray-900 mb-3 text-sm">未使用权益</h3>
                   <div className="grid grid-cols-3 gap-3">
                       {/* Specific "Create Date" Action Card */}
                       <div className="aspect-[4/5] rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-orange-100 transition-colors group">
                           <div className="w-10 h-10 rounded-full bg-mt-yellow flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
                               <Plus size={24} className="text-gray-900" />
                           </div>
                           <span className="text-xs font-bold text-orange-700">我想约会</span>
                       </div>

                       {/* Remaining Slots */}
                       {unusedRecords.slice(1).map((r, i) => (
                           <div key={r.id} className="aspect-[4/5] rounded-xl bg-white border border-gray-100 flex flex-col items-center justify-center gap-2 opacity-60">
                               <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                   <Heart size={20} className="text-gray-300" />
                               </div>
                               <span className="text-xs text-gray-400">待使用</span>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {/* 3. Completed History */}
           {completedRecords.length > 0 && (
               <div>
                   <h3 className="font-bold text-gray-900 mb-3 text-sm">历史记录</h3>
                   <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-50">
                       {completedRecords.map(r => (
                           <div key={r.id} className="p-4">
                               <div className="flex justify-between items-start mb-2">
                                   <div className="flex items-center gap-2">
                                       <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">已完成</span>
                                       <span className="text-xs text-gray-400">{r.date?.split(' ')[0]}</span>
                                   </div>
                               </div>
                               <div className="flex gap-3">
                                   {r.candidate && (
                                       <img src={r.candidate.avatar} className="w-10 h-10 rounded-full object-cover grayscale" />
                                   )}
                                   <div className="flex-1">
                                       <div className="text-sm font-bold text-gray-800 mb-1">与 {r.candidate?.name} 的约会</div>
                                       {r.feedback && (
                                           <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 leading-relaxed">
                                               <span className="font-bold text-gray-400 mr-1">我的反馈:</span>
                                               {r.feedback}
                                           </div>
                                       )}
                                       {r.feedbackTags && (
                                           <div className="flex gap-1 mt-2">
                                               {r.feedbackTags.map((t, i) => (
                                                   <span key={i} className="text-[9px] border border-gray-200 text-gray-400 px-1 rounded-sm">{t}</span>
                                               ))}
                                           </div>
                                       )}
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}
       </div>
    </div>
  );
};

export default OrderDetail;