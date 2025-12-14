import React, { useState } from 'react';
import { ChevronLeft, Upload, CheckCircle2, Building2, User, ChevronRight, FileText, Store, Info, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type EntryType = 'individual' | 'enterprise';

const MerchantEntry: React.FC<Props> = ({ onBack }) => {
  const [step, setStep] = useState<number>(0); // 0: Select Type, 1: Form, 2: Success
  const [entryType, setEntryType] = useState<EntryType | null>(null);
  const [hasLicense, setHasLicense] = useState<boolean>(true); // For individual: do they have a license?

  const handleTypeSelect = (type: EntryType) => {
    setEntryType(type);
    setStep(1);
  };

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-white text-center animate-in fade-in zoom-in duration-300">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <CheckCircle2 size={48} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-3">申请提交成功</h2>
      <p className="text-gray-500 mb-10 leading-relaxed text-sm max-w-xs">
        {entryType === 'individual' && !hasLicense 
          ? '您的入驻申请及个体户注册意向已收到，工作人员将在 1-3 个工作日内联系您协助办理。' 
          : '感谢您的加入！平台工作人员将在 1-3 个工作日 内审核您的资料，审核结果将通过短信通知。'}
      </p>
      <div className="w-full space-y-3">
        <button 
            onClick={onBack}
            className="w-full bg-mt-yellow text-gray-900 font-bold py-3.5 rounded-full shadow-lg active:scale-95 transition-transform"
        >
            返回个人中心
        </button>
        <button className="w-full bg-gray-100 text-gray-600 font-bold py-3.5 rounded-full active:scale-95 transition-transform">
            查看入驻进度
        </button>
      </div>
    </div>
  );

  const renderSelection = () => (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-safe-bottom">
       {/* Banner */}
       <div className="relative bg-[#1A1A1A] h-48 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" alt="Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
             <h1 className="text-2xl font-extrabold mb-1">商家入驻</h1>
             <p className="text-sm opacity-80">开启您的婚恋服务事业，连接每一份缘分</p>
          </div>
       </div>

       <div className="px-4 -mt-6 relative z-10 space-y-4">
           {/* Individual Card */}
           <div 
             onClick={() => handleTypeSelect('individual')}
             className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer relative overflow-hidden"
           >
              <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                      <User size={24} />
                  </div>
                  <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-1 rounded-full font-bold">
                      低门槛
                  </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">个人/工作室入驻</h3>
              <p className="text-xs text-gray-500 mb-4 h-8 leading-relaxed">适合独立红娘、情感咨询师、小型工作室。<br/>需注册个体工商户。</p>
              
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span>需要身份证 (正反面)</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span>需要个体户营业执照</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600 font-bold bg-orange-50/50 -mx-1 px-1 py-0.5 rounded">
                      <HelpCircle size={12} />
                      <span>无执照？平台免费协助办理</span>
                  </div>
              </div>
           </div>

           {/* Enterprise Card */}
           <div 
             onClick={() => handleTypeSelect('enterprise')}
             className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer"
           >
              <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                      <Building2 size={24} />
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold">
                      品牌展示
                  </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">企业/门店入驻</h3>
              <p className="text-xs text-gray-500 mb-4 h-8 leading-relaxed">适合婚恋公司、连锁门店、拥有正规资质的企业。</p>
              
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span>需要企业营业执照</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span>需要对公账户</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span>需要门店环境照片</span>
                  </div>
              </div>
           </div>
       </div>

       <div className="p-6 text-center pb-12">
          <p className="text-[10px] text-gray-400">入驻即代表同意 <span className="text-blue-500">《平台合作协议》</span></p>
       </div>
    </div>
  );

  const renderForm = () => (
     <div className="flex-1 overflow-y-auto pb-safe-bottom bg-gray-50">
        <div className="p-4 space-y-4">
            {/* Header Tip */}
            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-xs flex items-start gap-2 border border-blue-100">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                <p className="leading-5">
                    {entryType === 'individual' 
                        ? '根据《电商法》规定，入驻需办理市场主体登记。如您暂无营业执照，可选择“协助办理”进行电子化登记。' 
                        : '请确保上传的营业执照清晰可见，且在有效期内。审核通过后将获得“企业认证”标识。'}
                </p>
            </div>

            {/* Shop Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                    <Store size={18} className="text-mt-yellow" />
                    <h3 className="font-bold text-gray-900">店铺信息</h3>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">店铺名称 <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="给您的店铺起个名字" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:border-mt-yellow outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">主营类目 <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                         {['婚恋介绍', '情感咨询', '形象设计', '活动策划'].map((cat,i) => (
                             <button key={i} className={`px-3 py-1.5 rounded-lg text-xs border ${i===0 ? 'bg-mt-yellow/10 border-mt-yellow text-orange-800 font-bold' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                                 {cat}
                             </button>
                         ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">所在城市 <span className="text-red-500">*</span></label>
                    <div className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm flex justify-between items-center text-gray-900">
                        <span>深圳市 - 南山区</span>
                        <ChevronRight size={16} className="text-gray-400" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">详细地址 <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="街道、门牌号" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:border-mt-yellow outline-none" />
                </div>
            </div>

            {/* Subject Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                    <FileText size={18} className="text-mt-yellow" />
                    <h3 className="font-bold text-gray-900">
                        {entryType === 'individual' ? '主体信息 (个体户)' : '主体信息 (企业)'}
                    </h3>
                </div>

                {entryType === 'individual' && (
                    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">持有营业执照</span>
                        <div className="flex bg-gray-200 rounded-lg p-1">
                            <button 
                                onClick={() => setHasLicense(true)}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${hasLicense ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                            >
                                已有执照
                            </button>
                            <button 
                                onClick={() => setHasLicense(false)}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!hasLicense ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                            >
                                协助办理
                            </button>
                        </div>
                    </div>
                )}

                {!hasLicense && entryType === 'individual' && (
                     <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-orange-800 space-y-2">
                         <div className="font-bold flex items-center gap-1">
                             <HelpCircle size={14} /> 平台协助办理个体户说明：
                         </div>
                         <ul className="list-disc list-inside space-y-1 text-orange-700/80 pl-1">
                             <li>平台合作园区提供注册地址</li>
                             <li>全程电子化操作，无需跑腿</li>
                             <li>通常需要1-3个工作日</li>
                             <li>办理成功后将自动同步至平台</li>
                         </ul>
                     </div>
                )}

                {entryType === 'enterprise' && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">企业名称 <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="需与营业执照一致" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:border-mt-yellow outline-none" />
                    </div>
                )}

                {(hasLicense || entryType === 'enterprise') && (
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">营业执照照片 <span className="text-red-500">*</span></label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 hover:border-mt-yellow transition-all cursor-pointer">
                            <Upload size={24} className="mb-2" />
                            <span className="text-xs">点击上传 (支持JPG/PNG)</span>
                        </div>
                     </div>
                )}

                {entryType === 'individual' && (
                    <>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">经营者姓名 <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm outline-none" placeholder="真实姓名" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">联系电话 <span className="text-red-500">*</span></label>
                                <input type="tel" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm outline-none" placeholder="手机号" />
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">身份证照片 (正反面) <span className="text-red-500">*</span></label>
                             <div className="flex gap-3">
                                <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl h-24 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:border-mt-yellow transition-colors">
                                    <span className="text-[10px]">人像面</span>
                                </div>
                                <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl h-24 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:border-mt-yellow transition-colors">
                                    <span className="text-[10px]">国徽面</span>
                                </div>
                             </div>
                        </div>
                    </>
                )}
                
                {entryType === 'enterprise' && (
                    <>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">法定代表人姓名 <span className="text-red-500">*</span></label>
                            <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm outline-none" placeholder="需与执照一致" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">联系人电话 <span className="text-red-500">*</span></label>
                            <input type="tel" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm outline-none" placeholder="接收审核通知" />
                        </div>
                    </>
                )}
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                 <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                    <CheckCircle2 size={18} className="text-mt-yellow" />
                    <h3 className="font-bold text-gray-900">补充资料</h3>
                </div>
                 <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">店铺介绍 / 优势</label>
                      <textarea placeholder="请介绍您的从业经验、团队优势或资源情况..." className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:border-mt-yellow outline-none transition-all h-24 resize-none placeholder:text-gray-400"></textarea>
                  </div>
            </div>

            <div className="py-4 pb-12">
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full bg-mt-yellow text-gray-900 font-bold py-3.5 rounded-full shadow-md active:scale-95 transition-transform text-base"
                  >
                      {entryType === 'individual' && !hasLicense ? '提交并申请办理执照' : '提交审核'}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-3">
                      提交即代表您承诺所填信息真实有效
                  </p>
            </div>
        </div>
     </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col z-50 relative">
       {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 pt-safe-top">
        <ChevronLeft size={24} className="text-gray-700 cursor-pointer" onClick={() => step === 1 ? setStep(0) : onBack()} />
        <span className="font-bold text-lg text-gray-900">
            {step === 0 ? '商家入驻' : entryType === 'individual' ? '个人/工作室入驻' : '企业/门店入驻'}
        </span>
        <div className="w-6"></div>
      </div>

      {step === 0 && renderSelection()}
      {step === 1 && renderForm()}
      {step === 2 && renderSuccess()}
    </div>
  );
}
export default MerchantEntry;