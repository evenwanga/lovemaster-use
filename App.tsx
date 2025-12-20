import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin, Search, Mic, Menu, ChevronLeft, ChevronRight, Share2, MoreHorizontal, Star, Heart, MessageSquare, User, Home, ShieldCheck, CheckCircle2, Phone, Crown, Gem, Users, Coffee, Sparkles, Filter, ChevronDown, ArrowRight, Clock, Image as ImageIcon, FileText, Send, Smile, PlusCircle, X, ShoppingBag, CreditCard, XCircle, ScrollText, Wallet, Flame, History as HistoryIcon, Trash2, ArrowLeft, Building2, LayoutGrid, Gift, Zap, Bell, Volume2, VolumeX, Settings, Headphones, Ticket } from 'lucide-react';
import { MOCK_MATCHMAKERS, CATEGORIES, SERVICE_PACKAGES, MOCK_REVIEWS, REVIEW_TAGS, MOCK_ORDERS, MOCK_CHAT_THREADS, MOCK_CHAT_HISTORY } from './constants';
import { Matchmaker, Candidate, ServicePackage, Order, Message, ChatThread } from './types';
import MatchmakerCard from './components/MatchmakerCard';
import CandidateItem from './components/CandidateItem';
import CandidateDetail from './components/CandidateDetail';
import OrderDetail from './components/OrderDetail';
import SearchResultItem from './components/SearchResultItem';
import MerchantEntry from './components/MerchantEntry';
import BlackCard from './components/BlackCard';
import FavoriteMatchmakers from './components/FavoriteMatchmakers';
import History from './components/History';

enum View {
  HOME,
  MATCHMAKER_DETAIL,
  CANDIDATE_DETAIL,
  CHAT,
  ORDER_DETAIL,
  MERCHANT_ENTRY,
  BLACK_CARD,
  FAVORITE_MATCHMAKERS,
  HISTORY
}

// 1. Top Actions (Basic Capabilities) - Reverted to sit inside/below yellow header
const TOP_ACTIONS = [
  { name: '幸福黑卡', icon: CreditCard, id: 'black_card' },
  { name: '商户入驻', icon: Building2, id: 'merchant_entry' },
  { name: '收藏红娘', icon: Heart, id: 'favorite' },
  { name: '最近浏览', icon: HistoryIcon, id: 'history' },
];

// 2. Circular Nav (Professions) - King Kong Area
const CIRCULAR_NAV = [
    { name: '医生/护士', image: 'https://picsum.photos/seed/doc/200/200', color: 'bg-blue-50' },
    { name: '互联网', image: 'https://picsum.photos/seed/it/200/200', color: 'bg-purple-50' },
    { name: '国企/白领', image: 'https://picsum.photos/seed/civil/200/200', color: 'bg-orange-50' },
    { name: '全部', icon: LayoutGrid, color: 'bg-gray-100' },
];

// Helper interface for search results
interface SearchResult {
  candidate: Candidate;
  matchmaker: Matchmaker;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [activeHomeTab, setActiveHomeTab] = useState<'home' | 'orders' | 'messages' | 'mine'>('home');
  
  const [selectedMatchmaker, setSelectedMatchmaker] = useState<Matchmaker | null>(null);
  const [selectedCandidateForDetail, setSelectedCandidateForDetail] = useState<Candidate | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].id);
  // Changed from simple count to Set of IDs to track WHO is selected
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  
  const [activeFilter, setActiveFilter] = useState('nearby');
  const [activeDetailTab, setActiveDetailTab] = useState<'resources' | 'services' | 'reviews' | 'profile'>('resources');
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  // Change: Search results now contain candidate+matchmaker pairs
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Service Purchase State
  const [selectedService, setSelectedService] = useState<ServicePackage | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // Scroll active category into view
  useEffect(() => {
    if (currentView === View.MATCHMAKER_DETAIL && selectedCategory && activeDetailTab === 'resources') {
      const el = document.getElementById(`sidebar-item-${selectedCategory}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedCategory, currentView, activeDetailTab]);
  
  // Scroll to bottom of chat
  useEffect(() => {
    if (currentView === View.CHAT) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, currentView]);

  // ---- SEARCH LOGIC ----
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const lowerQuery = query.toLowerCase();
    
    // Smart Parsing: Extract height (3 digits, e.g., 160-199)
    const heightMatch = lowerQuery.match(/1[5-9][0-9]/); 
    const minHeight = heightMatch ? parseInt(heightMatch[0]) : 0;
    
    // Clean query for text matching
    const cleanQuery = lowerQuery
        .replace(/1[5-9][0-9]/g, '') // Remove height number
        .replace(/以上|cm|厘米|身高/g, '') // Remove units/words
        .trim();
        
    // Parse query for keywords (split by spaces)
    const keywords = cleanQuery.split(/[\s,，]+/).filter(k => k);

    const results: SearchResult[] = [];

    MOCK_MATCHMAKERS.forEach(mm => {
      mm.candidates.forEach(c => {
         // 1. Height Check (if query implies height)
         if (minHeight > 0 && c.height < minHeight) return;

         // 2. Keyword Check
         const searchString = `${c.name} ${c.job} ${c.education} ${c.hometown} ${c.tags.join(' ')} ${c.intro} ${c.requirements} ${c.age} ${c.categoryId}`.toLowerCase();
         // Check if ALL keywords match
         if (keywords.every(k => searchString.includes(k))) {
             results.push({
                 candidate: c,
                 matchmaker: mm
             });
         }
      });
    });

    setSearchResults(results);
  };

  const handleVoiceInput = () => {
    // Simulate voice input
    const mockVoiceText = "我要找个175以上的北京公务员";
    setIsSearching(true);
    setSearchQuery("");
    
    // Typing effect simulation
    let i = 0;
    const interval = setInterval(() => {
      setSearchQuery(mockVoiceText.slice(0, i + 1));
      i++;
      if (i === mockVoiceText.length) {
        clearInterval(interval);
        // After typing, convert to effective keywords and search
        setTimeout(() => {
            const effectiveQuery = "北京 公务员 175";
            setSearchQuery(effectiveQuery);
            handleSearch(effectiveQuery);
        }, 600);
      }
    }, 50);
  };

  const clearSearch = () => {
      setSearchQuery('');
      setIsSearching(false);
      setSearchResults([]);
  };

  // ---- NAVIGATION HANDLERS ----
  const handleMatchmakerClick = (matchmaker: Matchmaker) => {
    setSelectedMatchmaker(matchmaker);
    setCurrentView(View.MATCHMAKER_DETAIL);
    setSelectedCategory(CATEGORIES[0].id);
    setActiveDetailTab('resources');
    setSelectedCandidates(new Set());
  };

  const handleCandidateClick = (candidate: Candidate, matchmaker?: Matchmaker) => {
    setSelectedCandidateForDetail(candidate);
    if (matchmaker) {
        setSelectedMatchmaker(matchmaker);
    }
    setCurrentView(View.CANDIDATE_DETAIL);
  };
  
  const handleOrderClick = (order: Order) => {
      setSelectedOrder(order);
      setCurrentView(View.ORDER_DETAIL);
  };
  
  const handleBuyService = (pkg: ServicePackage) => {
    setSelectedService(pkg);
    setIsPaymentModalOpen(true);
  };

  const handleBack = () => {
    if (currentView === View.ORDER_DETAIL) {
        setCurrentView(View.HOME);
    } else if (currentView === View.CHAT) {
       if (selectedCandidateForDetail) {
           setCurrentView(View.CANDIDATE_DETAIL);
       } else if (selectedCandidates.size > 0 && selectedMatchmaker) {
           setCurrentView(View.MATCHMAKER_DETAIL);
       } else if (selectedMatchmaker) {
           setCurrentView(View.MATCHMAKER_DETAIL);
       } else {
           setCurrentView(View.HOME);
       }
    } else if (currentView === View.CANDIDATE_DETAIL) {
       setCurrentView(View.MATCHMAKER_DETAIL);
       setSelectedCandidateForDetail(null);
    } else if (currentView === View.MATCHMAKER_DETAIL) {
       setCurrentView(View.HOME);
       setSelectedMatchmaker(null);
    } else if (currentView === View.MERCHANT_ENTRY) {
        setCurrentView(View.HOME);
    } else if (currentView === View.BLACK_CARD) {
        setCurrentView(View.HOME);
    } else if (currentView === View.FAVORITE_MATCHMAKERS) {
        setCurrentView(View.HOME);
    } else if (currentView === View.HISTORY) {
        setCurrentView(View.HOME);
    }
  };

  const handleToggleInterest = (candidateId: string) => {
    const newSet = new Set(selectedCandidates);
    if (newSet.has(candidateId)) {
      newSet.delete(candidateId);
    } else {
      newSet.add(candidateId);
    }
    setSelectedCandidates(newSet);
  };
  
  // Logic for opening chat
  const handleOpenChat = (matchmaker: Matchmaker, fromDetail: boolean = false, specificCandidate: Candidate | null = null) => {
    setSelectedMatchmaker(matchmaker);
    
    // Check if we have history for this matchmaker
    const history = MOCK_CHAT_HISTORY[matchmaker.id];
    
    if (history && history.length > 0) {
        setChatMessages(history);
        setCurrentView(View.CHAT);
        // If specific candidate, we might want to append a new card, but for simplicity let's stick to history or reset
        // For this demo, if history exists, we show history. If specific candidate passed, we append it.
        if (specificCandidate) {
            const newCardMsg: Message = {
                id: 'user-new-' + Date.now(),
                sender: 'user',
                type: 'card',
                content: `我对嘉宾 ${specificCandidate.name} 感兴趣`,
                cardData: {
                    count: 1,
                    candidates: [specificCandidate],
                    title: '这个嘉宾不错，我想了解一下'
                },
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages(prev => [...prev, newCardMsg]);
        }
        return;
    }

    // Default "Fresh" Chat flow
    const initialMessages: Message[] = [
       {
           id: 'sys-1',
           sender: 'system',
           type: 'text',
           content: '安全提醒：请勿轻信转账汇款，平台交易更有保障。',
           time: '10:00'
       },
       {
           id: 'mm-1',
           sender: 'matchmaker',
           type: 'text',
           content: '您好！我是金牌红娘，请问有什么可以帮您？',
           time: '10:01'
       }
    ];

    if (specificCandidate) {
        initialMessages.push({
            id: 'user-0',
            sender: 'user',
            type: 'card',
            content: `我对嘉宾 ${specificCandidate.name} 感兴趣`,
            cardData: {
                count: 1,
                candidates: [specificCandidate],
                title: '这个嘉宾不错，我想了解一下'
            },
            time: '10:02'
        });
        
        setTimeout(() => {
            setChatMessages(prev => [...prev, {
                id: 'mm-2',
                sender: 'matchmaker',
                type: 'text',
                content: `您眼光真好！${specificCandidate.name}目前人气很高，您可以先告诉我您的基本情况，我帮您匹配一下。`,
                time: '10:02'
            }]);
        }, 1000);
    }
    else if (fromDetail && selectedCandidates.size > 0) {
        const candidatesList = matchmaker.candidates.filter(c => selectedCandidates.has(c.id));
        initialMessages.push({
            id: 'user-1',
            sender: 'user',
            type: 'card',
            content: '我对这些嘉宾很感兴趣',
            cardData: {
                count: selectedCandidates.size,
                candidates: candidatesList,
                title: '求脱单！麻烦红娘介绍一下'
            },
            time: '10:02'
        });
        
        setTimeout(() => {
            setChatMessages(prev => [...prev, {
                id: 'mm-2',
                sender: 'matchmaker',
                type: 'text',
                content: `收到！这${selectedCandidates.size}位嘉宾都很优秀，尤其是${candidatesList[0].name}，我来为您详细介绍一下~`,
                time: '10:02'
            }]);
        }, 1000);
    }

    setChatMessages(initialMessages);
    setCurrentView(View.CHAT);
  };
  
  const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      const newMsg: Message = {
          id: Date.now().toString(),
          sender: 'user',
          type: 'text',
          content: chatInput,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, newMsg]);
      setChatInput('');
      
      setTimeout(() => {
           setChatMessages(prev => [...prev, {
                id: 'mm-rep-' + Date.now(),
                sender: 'matchmaker',
                type: 'text',
                content: '好的，没问题。方便加个微信细聊吗？',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
           }]);
      }, 2000);
  };

  // ---- RENDER: PAYMENT MODAL ----
  const renderPaymentModal = () => {
      if (!isPaymentModalOpen || !selectedService || !selectedMatchmaker) return null;

      return (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
              <div 
                  className="absolute inset-0 bg-black/60 transition-opacity" 
                  onClick={() => setIsPaymentModalOpen(false)}
              ></div>
              <div className="bg-white w-full max-w-md rounded-t-2xl relative z-10 flex flex-col max-h-[85vh]">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-900">确认订单</h3>
                      <button onClick={() => setIsPaymentModalOpen(false)}>
                          <X size={24} className="text-gray-400" />
                      </button>
                  </div>
                  
                  <div className="p-4 overflow-y-auto">
                      {/* Service Card in Modal */}
                      <div className="flex gap-3 mb-4">
                          <div className="w-16 h-16 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                             <ShoppingBag size={24} />
                          </div>
                          <div className="flex-1">
                              <div className="font-bold text-gray-900 text-sm mb-1">{selectedService.title}</div>
                              <div className="text-xs text-gray-500 mb-1">{selectedMatchmaker.name}提供服务</div>
                              <div className="flex gap-2 text-[10px] text-orange-600">
                                  {selectedService.tags.map((tag,i) => (
                                      <span key={i} className="bg-orange-50 px-1 py-0.5 rounded">{tag}</span>
                                  ))}
                              </div>
                          </div>
                          <div className="text-right">
                              <div className="font-bold text-lg text-red-500">¥{selectedService.price}</div>
                              <div className="text-xs text-gray-400 line-through">¥{selectedService.originalPrice}</div>
                          </div>
                      </div>

                      {/* Payment Methods */}
                      <div className="space-y-3">
                          <div className="font-bold text-sm text-gray-900">支付方式</div>
                          <div className="flex items-center justify-between p-3 border border-green-500 bg-green-50 rounded-xl relative overflow-hidden">
                              <div className="flex items-center gap-2 relative z-10">
                                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">微</div>
                                  <span className="text-sm font-medium">微信支付</span>
                              </div>
                              <div className="w-4 h-4 rounded-full border-4 border-green-500"></div>
                              <div className="absolute right-0 top-0 text-[10px] bg-green-500 text-white px-2 rounded-bl-lg">推荐</div>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                              <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">支</div>
                                  <span className="text-sm text-gray-600">支付宝</span>
                              </div>
                              <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                          </div>
                      </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-white pb-safe-bottom">
                      <button 
                          onClick={() => {
                              alert('支付成功！红娘将尽快联系您安排服务。');
                              setIsPaymentModalOpen(false);
                          }}
                          className="w-full bg-mt-yellow text-gray-900 font-bold text-base py-3 rounded-full shadow-md active:scale-95 transition-transform flex items-center justify-center"
                      >
                          立即支付 ¥{selectedService.price}
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  // ---- RENDER: MATCHMAKER DETAIL VIEW ----
  const renderDetail = () => {
    if (!selectedMatchmaker) return null;

    const filteredCandidates = selectedMatchmaker.candidates.filter(c => {
        if (selectedCategory === 'all') return true;
        return c.categoryId === selectedCategory;
    });

    return (
      <div className="flex flex-col h-[100dvh] bg-gray-50">
        {/* Header Area */}
        <div className="relative bg-white z-10">
           {/* Navbar */}
           <div className="absolute top-0 left-0 right-0 p-3 pt-safe-top flex items-center justify-between z-20">
               <ChevronLeft size={24} className="text-white drop-shadow-md cursor-pointer" onClick={handleBack} />
               <div className="flex gap-4 text-white drop-shadow-md">
                   <Share2 size={20} />
                   <MoreHorizontal size={20} />
               </div>
           </div>

           {/* Hero Image / Banner */}
           <div className="h-32 bg-gray-800 relative overflow-hidden">
                <img src="https://picsum.photos/seed/cover1/800/400" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
           </div>
           
           {/* Profile Info */}
           <div className="px-4 pb-4 -mt-10 relative">
               <div className="flex justify-between items-end">
                    <div className="relative">
                        <img src={selectedMatchmaker.avatar} className="w-20 h-20 rounded-xl border-4 border-white shadow-md object-cover" />
                        {selectedMatchmaker.isVerified && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center border-2 border-white whitespace-nowrap">
                                <ShieldCheck size={10} className="mr-0.5" /> 实名认证
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 mb-1">
                        <button onClick={() => handleOpenChat(selectedMatchmaker)} className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">私信</button>
                        <button onClick={() => handleOpenChat(selectedMatchmaker)} className="px-4 py-1.5 bg-mt-yellow text-gray-900 text-xs font-bold rounded-full shadow-sm">+ 关注</button>
                    </div>
               </div>
               
               <div className="mt-3">
                   <h1 className="text-xl font-bold text-gray-900 flex items-center gap-1">
                       {selectedMatchmaker.name}
                       <span className="bg-orange-100 text-orange-700 text-[10px] px-1 rounded font-normal">{selectedMatchmaker.title}</span>
                   </h1>
                   <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                       <span className="flex items-center text-orange-500 font-bold"><Star size={12} fill="currentColor" className="mr-0.5"/> {selectedMatchmaker.rating}</span>
                       <span>月售 {selectedMatchmaker.monthlyOrders}</span>
                       <span>{selectedMatchmaker.deliveryTime}响应</span>
                   </div>
                   
                   {/* Badges */}
                   <div className="flex flex-wrap gap-2 mt-2">
                       {selectedMatchmaker.badges.map((b, i) => (
                           <span key={i} className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{b}</span>
                       ))}
                       {selectedMatchmaker.depositAmount && (
                            <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded flex items-center">
                                <Wallet size={10} className="mr-0.5" /> 已缴保 ¥{selectedMatchmaker.depositAmount}
                            </span>
                       )}
                   </div>
               </div>
           </div>
           
           {/* Tabs */}
           <div className="flex items-center border-b border-gray-100 px-4 mt-2">
               {['resources', 'services', 'reviews', 'profile'].map((tab) => (
                   <div 
                     key={tab}
                     onClick={() => setActiveDetailTab(tab as any)}
                     className={`flex-1 text-center py-3 text-sm font-bold relative cursor-pointer ${activeDetailTab === tab ? 'text-gray-900' : 'text-gray-400'}`}
                   >
                       {tab === 'resources' && '精选嘉宾'}
                       {tab === 'services' && '服务套餐'}
                       {tab === 'reviews' && '评价'}
                       {tab === 'profile' && '商家简介'}
                       {activeDetailTab === tab && (
                           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-mt-yellow rounded-full"></div>
                       )}
                   </div>
               ))}
           </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
            {activeDetailTab === 'resources' && (
                <div className="flex h-full">
                    {/* Sidebar */}
                    <div className="w-24 bg-gray-100 overflow-y-auto pb-20">
                        {CATEGORIES.map(cat => (
                            <div 
                                id={`sidebar-item-${cat.id}`}
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`
                                    p-3 text-xs font-medium cursor-pointer transition-colors relative
                                    ${selectedCategory === cat.id ? 'bg-white text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700'}
                                `}
                            >
                                {selectedCategory === cat.id && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-mt-yellow rounded-r"></div>
                                )}
                                {cat.name}
                            </div>
                        ))}
                    </div>
                    
                    {/* Main List */}
                    <div className="flex-1 p-3 overflow-y-auto pb-32 bg-white">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-gray-500">共 {filteredCandidates.length} 位嘉宾</span>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                <span>综合排序</span>
                                <ChevronDown size={12} />
                            </div>
                        </div>
                        
                        {filteredCandidates.length > 0 ? filteredCandidates.map(candidate => (
                            <CandidateItem 
                                key={candidate.id}
                                candidate={candidate}
                                isSelected={selectedCandidates.has(candidate.id)}
                                onToggle={() => handleToggleInterest(candidate.id)}
                                onClick={() => handleCandidateClick(candidate)}
                            />
                        )) : (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <Users size={32} className="mb-2 opacity-20" />
                                <span className="text-xs">暂无该分类嘉宾</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {activeDetailTab === 'services' && (
                <div className="p-4 space-y-3 pb-24">
                     {SERVICE_PACKAGES.map(pkg => (
                         <div key={pkg.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                             <div className="flex justify-between items-start mb-2">
                                 <div>
                                     <h3 className="font-bold text-gray-900">{pkg.title}</h3>
                                     <p className="text-xs text-gray-500 mt-0.5">{pkg.description}</p>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-lg font-bold text-red-500">¥{pkg.price}</div>
                                     <div className="text-xs text-gray-400 line-through">¥{pkg.originalPrice}</div>
                                 </div>
                             </div>
                             
                             <div className="flex flex-wrap gap-2 mb-3">
                                 {pkg.tags.map((tag, i) => (
                                     <span key={i} className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">{tag}</span>
                                 ))}
                             </div>
                             
                             <div className="space-y-1 mb-4">
                                 {pkg.features.map((feat, i) => (
                                     <div key={i} className="flex items-center text-xs text-gray-600">
                                         <CheckCircle2 size={12} className="text-green-500 mr-1.5" />
                                         {feat}
                                     </div>
                                 ))}
                             </div>
                             
                             <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                 <span className="text-xs text-gray-400">半年售出 {pkg.salesCount}</span>
                                 <button 
                                     onClick={() => handleBuyService(pkg)}
                                     className="px-4 py-1.5 bg-mt-yellow text-gray-900 text-xs font-bold rounded-full shadow-sm active:scale-95"
                                 >
                                     购买
                                 </button>
                             </div>
                         </div>
                     ))}
                </div>
            )}
            
            {activeDetailTab === 'reviews' && (
                <div className="bg-white min-h-full">
                     <div className="p-3 border-b border-gray-100 flex flex-wrap gap-2">
                         {REVIEW_TAGS.map((tag, i) => (
                             <span 
                                key={i} 
                                className={`text-xs px-2 py-1 rounded-sm border ${tag.active ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-200 text-gray-600'}`}
                             >
                                 {tag.label} {tag.count}
                             </span>
                         ))}
                     </div>
                     <div className="p-3 space-y-4 pb-24">
                         {MOCK_REVIEWS.map(review => (
                             <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0">
                                 <div className="flex justify-between items-start mb-2">
                                     <div className="flex items-center gap-2">
                                         <img src={review.userAvatar} className="w-8 h-8 rounded-full bg-gray-200" />
                                         <div>
                                             <div className="text-xs font-bold text-gray-900">{review.userName}</div>
                                             <div className="text-[10px] text-gray-400">{review.date}</div>
                                         </div>
                                     </div>
                                     <div className="flex text-orange-400">
                                         {[...Array(5)].map((_, i) => (
                                             <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                                         ))}
                                     </div>
                                 </div>
                                 <div className="text-sm text-gray-800 leading-relaxed mb-2">{review.content}</div>
                                 {review.images && (
                                     <div className="flex gap-2 mb-2">
                                         {review.images.map((img, i) => (
                                             <img key={i} src={img} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                                         ))}
                                     </div>
                                 )}
                                 {review.reply && (
                                     <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 leading-relaxed">
                                         <span className="font-bold text-orange-500 mr-1">商家回复:</span>
                                         {review.reply}
                                     </div>
                                 )}
                             </div>
                         ))}
                     </div>
                </div>
            )}

            {activeDetailTab === 'profile' && (
                 <div className="p-4 bg-gray-50 min-h-full pb-24 space-y-4">
                     {/* Card 1: Intro */}
                     <div className="bg-white rounded-xl p-4 shadow-sm">
                         <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
                             <div className="w-1 h-4 bg-mt-yellow rounded-full"></div>
                             红娘介绍
                         </h3>
                         <p className="text-sm text-gray-600 leading-7 text-justify">{selectedMatchmaker.intro}</p>
                     </div>
                     
                     {/* Card 2: Features */}
                     <div className="bg-white rounded-xl p-4 shadow-sm">
                         <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
                             <div className="w-1 h-4 bg-mt-yellow rounded-full"></div>
                             服务特色
                         </h3>
                         <div className="grid grid-cols-2 gap-3">
                             {['实名认证', '隐私保护', '人工审核', '高效匹配', '情感辅导', '全程跟踪'].map((item, i) => (
                                 <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                     <CheckCircle2 size={16} className="text-green-500" />
                                     <span className="text-sm text-gray-700">{item}</span>
                                 </div>
                             ))}
                         </div>
                     </div>

                     {/* Card 3: Info */}
                     <div className="bg-white rounded-xl p-4 shadow-sm">
                         <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
                             <div className="w-1 h-4 bg-mt-yellow rounded-full"></div>
                             营业信息
                         </h3>
                         <div className="space-y-4 text-sm text-gray-600">
                             <div className="flex items-start gap-3">
                                 <Clock size={18} className="text-gray-400 mt-0.5" />
                                 <div>
                                     <div className="font-bold text-gray-900 mb-0.5">营业时间</div>
                                     <span>周一至周日 09:00 - 21:00</span>
                                 </div>
                             </div>
                             <div className="w-full h-px bg-gray-50"></div>
                             <div className="flex items-start gap-3">
                                 <MapPin size={18} className="text-gray-400 mt-0.5" />
                                 <div>
                                     <div className="font-bold text-gray-900 mb-0.5">门店地址</div>
                                     <span>深圳市南山区科技园大冲商务中心C座1808</span>
                                 </div>
                                 <div className="ml-auto border-l border-gray-100 pl-3">
                                     <Phone size={20} className="text-mt-yellow fill-current" />
                                 </div>
                             </div>
                         </div>
                     </div>
                     
                     {/* Card 4: Photos */}
                     <div className="bg-white rounded-xl p-4 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
                             <div className="w-1 h-4 bg-mt-yellow rounded-full"></div>
                             门店环境
                        </h3>
                         <div className="h-32 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs border border-dashed border-gray-300">
                             <div className="flex flex-col items-center gap-1">
                                <ImageIcon size={24} />
                                <span>暂无门店照片</span>
                             </div>
                         </div>
                     </div>
                 </div>
            )}
        </div>
        
        {/* Floating Cart (Meituan Capsule Style) - Optimized for Adaptation */}
        {activeDetailTab === 'resources' && selectedCandidates.size > 0 && (
             <div className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-4 pb-safe-bottom pointer-events-none animate-in slide-in-from-bottom-full duration-500 ease-out">
                 <div className="max-w-md mx-auto pointer-events-auto">
                    <div className="bg-[#222426]/95 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-2 pl-4 flex items-center justify-between border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#333537] to-[#1a1c1e] rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                                    <Heart size={22} fill="currentColor" className="text-mt-yellow animate-pulse" />
                                </div>
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] min-w-[1.4rem] h-5.5 px-1.5 rounded-full flex items-center justify-center border-2 border-[#222426] shadow-sm font-bold">
                                    {selectedCandidates.size}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-sm font-bold text-white">已选 {selectedCandidates.size} 位嘉宾</div>
                                <div className="text-[10px] text-white/50">向红娘发起多位咨询成功率更高</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleOpenChat(selectedMatchmaker, true)}
                            className="px-8 py-3 bg-mt-yellow hover:bg-yellow-400 text-gray-900 font-extrabold text-sm rounded-full shadow-lg active:scale-95 transition-all"
                        >
                            去咨询
                        </button>
                    </div>
                 </div>
             </div>
        )}
      </div>
    );
  };

  // ---- RENDER: CHAT VIEW ----
  const renderChat = () => {
      if (!selectedMatchmaker) return null;
      
      return (
          <div className="flex flex-col h-[100dvh] bg-gray-100">
             {/* Header */}
             <div className="bg-white px-3 py-3 flex items-center justify-between shadow-sm flex-shrink-0 z-10 pt-safe-top">
                 <div className="flex items-center gap-3">
                     <ChevronLeft size={24} onClick={handleBack} className="text-gray-700 cursor-pointer" />
                     <div className="flex items-center gap-2">
                         <div className="relative">
                             <img src={selectedMatchmaker.avatar} className="w-9 h-9 rounded-full border border-gray-100 object-cover" />
                             <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                         </div>
                         <div className="flex flex-col">
                             <span className="font-bold text-sm text-gray-900">{selectedMatchmaker.name}</span>
                             <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                 在线 | 平均1分钟回复
                             </span>
                         </div>
                     </div>
                 </div>
                 <div className="flex items-center gap-4 text-gray-600">
                     <Phone size={20} />
                     <MoreHorizontal size={20} />
                 </div>
             </div>
             
             {/* Messages Area */}
             <div className="flex-1 overflow-y-auto p-3 space-y-4">
                 {chatMessages.map(msg => {
                     const isUser = msg.sender === 'user';
                     
                     if (msg.sender === 'system') {
                         return (
                             <div key={msg.id} className="flex justify-center my-2">
                                 <span className="bg-gray-200 text-gray-500 text-[10px] px-2 py-1 rounded-full">{msg.content}</span>
                             </div>
                         );
                     }
                     
                     return (
                         <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                             {!isUser && (
                                 <img src={selectedMatchmaker.avatar} className="w-8 h-8 rounded-full mr-2 self-start" />
                             )}
                             
                             <div className={`max-w-[75%] space-y-1 ${isUser ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
                                 {/* Actual Bubble */}
                                 {msg.type === 'card' && msg.cardData ? (
                                     <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 w-64">
                                         <div className="bg-orange-50 px-3 py-2 border-b border-orange-100 flex justify-between items-center">
                                             <span className="text-xs font-bold text-orange-800">心仪嘉宾 ({msg.cardData.count})</span>
                                             <span className="text-[10px] text-orange-600">已发送</span>
                                         </div>
                                         <div className="p-2 space-y-2">
                                              {msg.cardData.candidates.slice(0, 3).map(c => (
                                                  <div key={c.id} className="flex gap-2 bg-gray-50 p-1.5 rounded-lg">
                                                      <img src={c.avatar} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                                                      <div className="min-w-0 flex flex-col justify-center">
                                                          <div className="text-xs font-bold text-gray-800 truncate">{c.name}</div>
                                                          <div className="text-[10px] text-gray-500 truncate">{c.age}岁 • {c.job} • {c.salary}</div>
                                                      </div>
                                                  </div>
                                              ))}
                                              {msg.cardData.count > 3 && (
                                                  <div className="text-center text-[10px] text-gray-400">等 {msg.cardData.count} 位嘉宾</div>
                                              )}
                                              <div className="text-xs text-gray-800 font-medium px-1">
                                                  "{msg.cardData.title}"
                                              </div>
                                         </div>
                                     </div>
                                 ) : (
                                     <div 
                                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                                        ${isUser 
                                            ? 'bg-mt-yellow text-gray-900 rounded-tr-sm' 
                                            : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'}
                                        `}
                                     >
                                         {msg.content}
                                     </div>
                                 )}
                                 <span className="text-[10px] text-gray-300 px-1">{msg.time}</span>
                             </div>

                             {isUser && (
                                 <div className="w-8 h-8 rounded-full ml-2 bg-gray-300 flex items-center justify-center text-gray-500 flex-shrink-0">
                                     <User size={16} />
                                 </div>
                             )}
                         </div>
                     );
                 })}
                 <div ref={chatEndRef} />
             </div>
             
             {/* Input Area */}
             <div className="bg-white border-t border-gray-100 p-2 pb-safe-bottom">
                 <div className="flex items-center gap-2 mb-2">
                     <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full cursor-pointer">您好，我想了解服务流程</span>
                     <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full cursor-pointer">嘉宾信息真实吗？</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <Mic size={24} className="text-gray-400" />
                     <div className="flex-1 bg-gray-100 rounded-full flex items-center px-3 py-2">
                         <input 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            type="text" 
                            className="flex-1 bg-transparent outline-none text-sm text-gray-900" 
                            placeholder="发消息..."
                        />
                         <Smile size={20} className="text-gray-400 ml-2" />
                     </div>
                     {chatInput.trim() ? (
                         <button onClick={handleSendMessage} className="bg-mt-yellow text-black font-bold text-sm px-4 py-2 rounded-full">发送</button>
                     ) : (
                         <PlusCircle size={26} className="text-gray-400" />
                     )}
                 </div>
             </div>
          </div>
      )
  };

  // ---- RENDER: ORDERS TAB ----
  const renderOrdersTab = () => {
    return (
      <div className="h-full bg-gray-100 flex flex-col">
          {/* Header */}
          <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center justify-center pt-safe-top">
             <span className="text-lg font-bold text-gray-900">订单列表</span>
          </div>
          
          {/* Filter/Tabs for Orders */}
          <div className="bg-white px-4 py-2 flex items-center gap-6 text-sm border-b border-gray-100 sticky top-[calc(44px+env(safe-area-inset-top))] z-10">
              <span className="font-bold text-gray-900 border-b-2 border-mt-yellow pb-2">全部</span>
              <span className="text-gray-500 pb-2">待使用</span>
              <span className="text-gray-500 pb-2">待评价</span>
              <span className="text-gray-500 pb-2">退款/售后</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-24">
              {MOCK_ORDERS.map(order => (
                  <div key={order.id} onClick={() => handleOrderClick(order)} className="bg-white rounded-xl p-4 shadow-sm active:scale-[0.99] transition-transform cursor-pointer">
                      {/* Merchant Header */}
                      <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
                          <div className="flex items-center gap-2">
                              <img src={order.merchantAvatar} className="w-5 h-5 rounded-full" />
                              <span className="font-bold text-sm text-gray-800">{order.merchantName}</span>
                              <ChevronRight size={14} className="text-gray-400" />
                          </div>
                          <span className={`text-xs ${order.status === 'unused' ? 'text-orange-500 font-bold' : 'text-gray-500'}`}>
                              {order.status === 'unused' ? '待使用' : order.status === 'used' ? '已完成' : '已退款'}
                          </span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex gap-3 mb-3">
                          <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                               <ShoppingBag size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                               <div className="flex justify-between items-start">
                                   <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{order.serviceTitle}</h4>
                                   <span className="text-sm font-bold text-black">¥{order.price}</span>
                               </div>
                               <div className="text-xs text-gray-500 mt-1">下单时间：{order.date}</div>
                               <div className="flex flex-wrap gap-1 mt-2">
                                   {order.tags.map((tag,i) => (
                                       <span key={i} className="text-[10px] text-orange-600 border border-orange-100 bg-orange-50 px-1 rounded-sm">{tag}</span>
                                   ))}
                               </div>
                          </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                          <button className="px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 font-medium">联系商家</button>
                          {order.status === 'unused' ? (
                              <button className="px-3 py-1.5 rounded-full bg-mt-yellow text-xs text-gray-900 font-bold">去使用</button>
                          ) : (
                              <button className="px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 font-medium">再来一单</button>
                          )}
                      </div>
                  </div>
              ))}
              
              <div className="text-center text-xs text-gray-400 py-4">显示最近一年的订单</div>
          </div>
      </div>
    );
  }

  // ---- RENDER: MESSAGES TAB ----
  const renderMessagesTab = () => {
    return (
        <div className="h-full bg-white flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between pt-safe-top">
                <span className="text-lg font-bold text-gray-900">消息</span>
                <div className="flex gap-4 text-gray-800">
                    <Bell size={20} />
                    <PlusCircle size={20} />
                </div>
            </div>

            {/* Sub-header Actions */}
            <div className="flex justify-between px-6 py-4 border-b border-gray-50">
                <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                        <Bell size={20} />
                    </div>
                    <span className="text-xs text-gray-600">系统通知</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <MessageSquare size={20} />
                    </div>
                    <span className="text-xs text-gray-600">互动消息</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                     <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                        <Gift size={20} />
                    </div>
                    <span className="text-xs text-gray-600">活动优惠</span>
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto pb-24">
                {MOCK_CHAT_THREADS.map(thread => {
                    const matchmaker = MOCK_MATCHMAKERS.find(m => m.id === thread.matchmakerId);
                    if (!matchmaker) return null;

                    return (
                        <div 
                            key={thread.id} 
                            onClick={() => handleOpenChat(matchmaker)}
                            className={`flex gap-3 p-4 border-b border-gray-50 active:bg-gray-50 transition-colors cursor-pointer ${thread.isTop ? 'bg-gray-50/50' : ''}`}
                        >
                            <div className="relative flex-shrink-0">
                                <img src={matchmaker.avatar} className="w-12 h-12 rounded-lg object-cover" />
                                {thread.unreadCount > 0 && (
                                    <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm font-bold">
                                        {thread.unreadCount}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-gray-900 text-sm truncate">{matchmaker.name}</h3>
                                    <span className="text-[10px] text-gray-400">{thread.lastMessageTime}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-500 truncate pr-4">{thread.lastMessage}</p>
                                    <div className="text-gray-300">
                                        {/* Optional Mute Icon */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State / Bottom Text */}
                {MOCK_CHAT_THREADS.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <MessageSquare size={48} className="mb-2 opacity-20" />
                        <p className="text-xs">暂无聊天记录</p>
                    </div>
                )}
                
                <div className="text-center py-6 text-gray-300 text-xs">没有更多消息了</div>
            </div>
        </div>
    )
  }

  // ---- RENDER: MINE TAB ----
  const renderMineTab = () => {
    return (
      <div className="h-full bg-gray-100 flex flex-col relative overflow-y-auto pb-24">
        {/* Header Background */}
        <div className="bg-mt-yellow pt-safe-top px-4 pb-12 relative">
           <div className="flex justify-end mb-4">
              <Settings size={20} className="text-gray-900"/>
              <MessageSquare size={20} className="text-gray-900 ml-4"/>
           </div>
           
           <div className="flex items-center gap-3 mb-4">
               <img src="https://picsum.photos/seed/me/200/200" className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
               <div className="flex-1 text-gray-900">
                   <div className="flex items-center gap-2">
                       <h2 className="text-lg font-bold">微信用户</h2>
                       <div className="bg-black/10 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center">
                           <Crown size={10} className="mr-0.5" /> L1 会员
                       </div>
                   </div>
                   <div className="flex items-center text-xs opacity-70 mt-0.5">
                       <span>ID: 887210</span>
                       <span className="mx-2">|</span>
                       <span className="flex items-center">个人主页 <ChevronRight size={10} /></span>
                   </div>
               </div>
           </div>
        </div>

        {/* Floating Cards Container */}
        <div className="px-3 -mt-8 relative z-10 space-y-3">
             {/* Stats Card */}
             <div className="bg-white rounded-xl p-4 shadow-sm flex justify-around text-center">
                 {[
                     { label: '关注', val: 12 },
                     { label: '收藏', val: 5 },
                     { label: '足迹', val: 108 },
                     { label: '红包', val: 2 }
                 ].map((item, i) => (
                     <div key={i} className="flex flex-col items-center gap-1">
                         <span className="font-bold text-lg text-gray-900">{item.val}</span>
                         <span className="text-xs text-gray-500">{item.label}</span>
                     </div>
                 ))}
             </div>

             {/* Order Card */}
             <div className="bg-white rounded-xl p-4 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-sm text-gray-900">我的订单</h3>
                     <span className="text-xs text-gray-400 flex items-center">全部订单 <ChevronRight size={12} /></span>
                 </div>
                 <div className="flex justify-between px-2">
                      {[
                          { label: '待付款', icon: Wallet },
                          { label: '待使用', icon: Ticket },
                          { label: '进行中', icon: Coffee },
                          { label: '待评价', icon: MessageSquare },
                          { label: '退款/售后', icon: ShieldCheck }
                      ].map((item, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 relative">
                               <item.icon size={24} className="text-gray-600" />
                               <span className="text-xs text-gray-600">{item.label}</span>
                               {i === 1 && (
                                   <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 rounded-full border border-white">2</div>
                               )}
                          </div>
                      ))}
                 </div>
             </div>

             {/* Wallet Banner */}
             <div className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between">
                 <div className="flex items-center gap-3">
                     <div className="bg-red-50 p-2 rounded-lg">
                         <Wallet size={20} className="text-red-500" />
                     </div>
                     <div>
                         <div className="font-bold text-sm text-gray-900">我的钱包</div>
                         <div className="text-xs text-gray-400">余额 ¥0.00</div>
                     </div>
                 </div>
                 <button className="bg-gray-100 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700">
                     去充值
                 </button>
             </div>

             {/* Tools Grid */}
             <div className="bg-white rounded-xl p-4 shadow-sm">
                 <h3 className="font-bold text-sm text-gray-900 mb-4">常用功能</h3>
                 <div className="grid grid-cols-4 gap-y-4">
                     {[
                         { label: '我的资料', icon: User },
                         { label: '实名认证', icon: ShieldCheck, sub: '已认证' },
                         { label: '择偶要求', icon: Heart },
                         { label: '客服中心', icon: Headphones },
                         { label: '商家入驻', icon: Building2, action: () => setCurrentView(View.MERCHANT_ENTRY) },
                         { label: '设置', icon: Settings },
                     ].map((item, i) => (
                         <div 
                             key={i} 
                             className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                             onClick={item.action ? item.action : undefined}
                        >
                             <item.icon size={24} className="text-gray-600" />
                             <span className="text-xs text-gray-600">{item.label}</span>
                             {item.sub && <span className="text-[9px] text-gray-300">{item.sub}</span>}
                         </div>
                     ))}
                 </div>
             </div>
        </div>
      </div>
    );
  }

  // ---- RENDER: HOME VIEW ----
  const renderHome = () => (
    <div className="h-[100dvh] flex flex-col bg-gray-100 relative overflow-hidden">
      
      {/* Dynamic Content based on ActiveHomeTab */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
          {activeHomeTab === 'home' && (
              <>
                {/* Header (Search Mode vs Normal Mode) */}
                {isSearching ? (
                    <div className="sticky top-0 z-50 bg-white shadow-sm pt-safe-top">
                        {/* Search Input Row */}
                        <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-50">
                            <ArrowLeft size={22} className="text-gray-800" onClick={clearSearch} />
                            
                            {/* Search Box */}
                            <div className="flex-1 bg-gray-100 rounded-full h-9 flex items-center px-3 gap-2 relative border border-transparent">
                                <span className="flex items-center gap-1 text-xs font-bold text-gray-800 border-r border-gray-300 pr-2 mr-1 whitespace-nowrap">
                                    搜秒答 <ChevronDown size={10} />
                                </span>
                                
                                <input 
                                    ref={searchInputRef}
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="找个175以上的医生" 
                                    className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 min-w-0"
                                    autoFocus
                                />
                                {searchQuery && (
                                    <X size={16} className="text-gray-400" onClick={() => setSearchQuery('')} />
                                )}
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                                <MapPin size={10} />
                                <span className="truncate max-w-[60px]">塘朗城A座</span>
                                <ChevronRight size={10} className="text-gray-400" />
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="px-0 pb-1 pt-1 bg-white">
                            <div className="flex items-center justify-between px-4 text-xs text-gray-600 font-medium mb-2">
                                <span className="font-bold text-gray-900 flex items-center">综合排序 <ChevronDown size={10} className="ml-1"/></span>
                                <span className="flex items-center">距离 <ChevronDown size={10} className="ml-1"/></span>
                                <span>切到店铺</span>
                                <span className="flex items-center">筛选 <Filter size={10} className="ml-1"/></span>
                            </div>
                            
                            <div className="flex gap-2 px-3 overflow-x-auto no-scrollbar pb-2">
                                {['官方认证', '在线秒回', '资料核验', '金牌红娘', '成功率高'].map((tag, i) => (
                                    <span key={i} className="bg-gray-100 text-[10px] px-2 py-1 rounded text-gray-600 flex-shrink-0">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Default Home Header - REVERTED TO MEITUAN YELLOW STYLE */
                    <div className="relative z-10">
                        {/* Yellow Header Container */}
                        <div className="bg-mt-yellow pb-4 rounded-b-[1.5rem] relative shadow-sm">
                             {/* Top Bar: Search */}
                             <div className="flex items-center gap-2 px-3 pt-safe-top pb-2">
                                <div className="flex items-center gap-1 min-w-[60px]">
                                  <MapPin size={16} className="text-gray-900" />
                                  <span className="font-bold text-sm text-gray-900 truncate">深圳</span>
                                  <ChevronDown size={12} className="text-gray-900" />
                                </div>
                                
                                <div className="flex-1 bg-white rounded-full h-8 flex items-center px-3 gap-2 shadow-sm transition-all duration-300">
                                  <Search size={14} className="text-gray-400" />
                                  <input 
                                    ref={searchInputRef}
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onFocus={() => setIsSearching(true)}
                                    placeholder="试试说“找个175以上的医生”" 
                                    className="flex-1 bg-transparent text-xs outline-none placeholder-gray-400"
                                  />
                                  <div className="border-l border-gray-200 pl-2">
                                      <Mic 
                                        size={14} 
                                        className={`cursor-pointer ${searchQuery ? 'text-mt-yellow fill-current' : 'text-gray-500'}`}
                                        onClick={handleVoiceInput}
                                      />
                                  </div>
                                </div>
                                <Menu size={20} className="text-gray-900 ml-1" />
                             </div>

                             {/* Top Actions (Basic Capabilities) - Inside Yellow Area */}
                             <div className="flex justify-between px-6 mt-2 text-gray-900">
                                 {TOP_ACTIONS.map((action, idx) => (
                                     <div 
                                        key={idx} 
                                        className="flex flex-col items-center gap-1.5 cursor-pointer"
                                        onClick={() => {
                                            if (action.id === 'merchant_entry') {
                                                setCurrentView(View.MERCHANT_ENTRY);
                                            } else if (action.id === 'black_card') {
                                                setCurrentView(View.BLACK_CARD);
                                            } else if (action.id === 'favorite') {
                                                setCurrentView(View.FAVORITE_MATCHMAKERS);
                                            } else if (action.id === 'history') {
                                                setCurrentView(View.HISTORY);
                                            }
                                        }}
                                    >
                                         <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-black/5 shadow-sm active:scale-95 transition-transform">
                                             <action.icon size={20} className="text-gray-900" />
                                         </div>
                                         <span className="text-[11px] font-bold opacity-90">{action.name}</span>
                                     </div>
                                 ))}
                             </div>
                        </div>
                        
                        {/* Circular Category Nav (Professions) */}
                        <div className="px-4 mt-4">
                            <div className="flex justify-between px-2">
                                {CIRCULAR_NAV.map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2">
                                        <div className={`w-12 h-12 rounded-full ${item.color} p-0.5 shadow-sm border border-gray-100 overflow-hidden`}>
                                            {item.image ? (
                                                <img src={item.image} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full rounded-full flex items-center justify-center bg-white text-gray-400">
                                                    {item.icon && <item.icon size={20} />}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-700 font-medium">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Newcomer Gift Section */}
                        <div className="px-3 mt-5">
                            <div className="bg-white rounded-xl p-3 shadow-sm border border-red-50 relative overflow-hidden">
                                {/* Title Line */}
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-1">
                                        <div className="bg-red-500 rounded p-0.5">
                                            <Gift size={12} className="text-white" />
                                        </div>
                                        <span className="font-bold text-gray-900 text-sm">新人专享 · 大礼包</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 flex items-center">
                                        更多优惠券 <ChevronRight size={10} />
                                    </span>
                                </div>
                                {/* Coupons */}
                                <div className="grid grid-cols-4 gap-2">
                                    {[1999, 999, 520, 199].map((val, i) => (
                                        <div key={i} className="bg-red-50 border border-red-100 rounded-lg py-2 flex flex-col items-center justify-center relative">
                                            <div className="text-red-500 font-extrabold text-sm"><span className="text-[10px]">¥</span>{val}</div>
                                            <div className="text-[9px] text-red-400">现金券</div>
                                            <div className="mt-1 bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-full">去使用</div>
                                            {/* Dotted line decoration */}
                                            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                                            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Activity Grid (Recommend + Newcomers + Instant) */}
                        <div className="px-3 mt-3 flex gap-3 h-48">
                            {/* Left: Recommended Project -> 推荐对象 */}
                            <div className="w-2/5 bg-white rounded-xl p-3 shadow-sm flex flex-col justify-between relative overflow-hidden">
                                <div>
                                    <div className="font-bold text-gray-900 text-sm flex items-center justify-between">
                                        推荐对象
                                        <span className="text-[10px] text-emerald-600 flex items-center">全部 <ChevronRight size={8} /></span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">高端定制 · 成功率高</div>
                                </div>
                                
                                <div className="mt-2 flex-1 relative rounded-lg overflow-hidden bg-gray-50">
                                    <img src="https://picsum.photos/seed/spa/300/400" className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                        <div className="text-white font-bold text-xs">高端猎头</div>
                                        <div className="text-[9px] text-white/80">海归/硕博专区</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Newcomers & Instant Reply */}
                            <div className="flex-1 flex flex-col gap-3">
                                {/* Top Right: Newcomers */}
                                <div className="flex-1 bg-white rounded-xl p-3 shadow-sm relative overflow-hidden flex flex-col justify-center">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-900 text-sm">新人上线</span>
                                        <span className="text-[10px] text-emerald-600 flex items-center">更多 <ChevronRight size={8} /></span>
                                    </div>
                                    <div className="flex justify-around">
                                        {[1,2,3].map((_, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                                                    <img src={`https://picsum.photos/seed/new${i}/100/100`} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-[9px] text-gray-600">安安</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Right: Instant Reply -> 极速沟通 (Merchants) */}
                                <div className="flex-1 bg-white rounded-xl p-3 shadow-sm relative overflow-hidden flex flex-col justify-center">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-900 text-sm flex items-center gap-1">
                                            极速沟通 <Zap size={10} className="text-yellow-500 fill-yellow-500"/>
                                        </span>
                                        <span className="text-[10px] text-emerald-600 flex items-center">更多 <ChevronRight size={8} /></span>
                                    </div>
                                    <div className="flex justify-around">
                                        {MOCK_MATCHMAKERS.slice(0, 3).map((m, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-green-500 p-0.5">
                                                     <img src={m.avatar} className="w-full h-full object-cover rounded-full" />
                                                </div>
                                                <span className="text-[9px] text-gray-600 truncate w-12 text-center">{m.name.slice(0, 4)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Marketing Banner (User Education) - Pushed Down */}
                        <div className="px-3 mt-3">
                            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-3 flex items-center justify-between border border-orange-100 shadow-sm relative overflow-hidden">
                                {/* Decorative background circle */}
                                <div className="absolute right-0 top-0 w-20 h-20 bg-white/40 rounded-full -mr-6 -mt-6 pointer-events-none"></div>
                                
                                <div className="flex-1 relative z-10">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-sm font-bold text-gray-900">三步找到对的人</span>
                                        <span className="text-[10px] text-orange-600 bg-white/60 px-1.5 py-0.5 rounded-sm">官方认证 · 平台担保</span>
                                    </div>
                                    <div className="flex items-center text-[11px] text-gray-600 font-medium">
                                        <span className="font-bold text-orange-700">1.选红娘</span>
                                        <ArrowRight size={10} className="mx-1 text-orange-300" />
                                        <span>2.聊需求</span>
                                        <ArrowRight size={10} className="mx-1 text-gray-300" />
                                        <span>3.去约会</span>
                                    </div>
                                </div>
                                
                                <div className="flex-shrink-0 bg-white/80 w-8 h-8 flex items-center justify-center rounded-full shadow-sm ml-2 z-10">
                                    <ArrowRight size={16} className="text-orange-500" />
                                </div>
                            </div>
                        </div>

                        {/* Filter Bar (Capsule Style) - Repositioned */}
                        <div className="sticky top-0 z-40 bg-gray-100/95 backdrop-blur-sm px-3 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
                          {[
                              { id: 'nearby', label: '附近' },
                              { id: 'sales', label: '销量最高' },
                              { id: 'rating', label: '评分最高' },
                              { id: 'verified', label: '实名商家' }
                          ].map(filter => (
                              <button 
                                  key={filter.id}
                                  onClick={() => setActiveFilter(filter.id)}
                                  className={`
                                    px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border
                                    ${activeFilter === filter.id 
                                        ? 'bg-white text-gray-900 border-gray-200 shadow-sm' 
                                        : 'bg-white/50 text-gray-500 border-transparent'}
                                  `}
                              >
                                  {filter.label}
                              </button>
                          ))}
                        </div>
                    </div>
                )}

                {!isSearching ? (
                  <>
                    {/* Merchant List Header - NEW */}
                    <div className="px-3 pb-2 flex items-center justify-between">
                        <div className="font-bold text-base text-gray-900">推荐商户</div>
                        <div className="text-xs text-emerald-600 font-medium flex items-center">
                            更多商户 <ChevronRight size={12} />
                        </div>
                    </div>

                    {/* Merchant List */}
                    <div className="px-3 pb-20 space-y-3">
                      {MOCK_MATCHMAKERS.map(m => (
                        <MatchmakerCard 
                          key={m.id} 
                          data={m} 
                          onClick={() => handleMatchmakerClick(m)}
                          onConsult={() => handleOpenChat(m, false)} // Scenario 1: Direct Consult
                        />
                      ))}
                      {/* Duplicate for scrolling feel */}
                      {MOCK_MATCHMAKERS.map(m => (
                        <MatchmakerCard 
                          key={`${m.id}-dup`} 
                          data={m} 
                          onClick={() => handleMatchmakerClick(m)}
                          onConsult={() => handleOpenChat(m, false)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  /* SEARCH RESULTS VIEW */
                  <div className="bg-gray-50 min-h-full pb-20">
                     {/* Search Tags / History (Only if query is empty or few results) */}
                     {searchQuery.length === 0 && (
                         <div className="p-4 bg-white mb-2">
                             <div className="flex justify-between items-center mb-3">
                                 <span className="font-bold text-sm text-gray-900">热门搜索</span>
                                 <Flame size={14} className="text-red-500" />
                             </div>
                             <div className="flex flex-wrap gap-2">
                                 {['90后公务员', '海归硕士', '教师 165', '三甲医生', '金融男'].map((tag, i) => (
                                     <button 
                                        key={i} 
                                        onClick={() => handleSearch(tag)}
                                        className="bg-gray-100 text-xs px-3 py-1.5 rounded-full text-gray-600"
                                     >
                                         {tag}
                                     </button>
                                 ))}
                             </div>
                         </div>
                     )}

                     {/* Results List */}
                     <div className="p-3">
                        {searchResults.length > 0 ? (
                             <>
                                {searchResults.map((item, idx) => (
                                    <SearchResultItem 
                                        key={idx}
                                        candidate={item.candidate}
                                        matchmaker={item.matchmaker}
                                        onClick={() => handleCandidateClick(item.candidate, item.matchmaker)}
                                        onConsult={() => handleOpenChat(item.matchmaker, false, item.candidate)}
                                    />
                                ))}
                             </>
                        ) : searchQuery.length > 0 && (
                             <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                 <Search size={48} className="mb-2 opacity-20" />
                                 <p className="text-xs">未找到符合“{searchQuery}”的嘉宾</p>
                                 <button 
                                    onClick={clearSearch}
                                    className="mt-4 px-6 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm"
                                 >
                                     查看全部商户
                                 </button>
                             </div>
                        )}
                     </div>
                  </div>
                )}
              </>
          )}

          {activeHomeTab === 'orders' && renderOrdersTab()}

          {activeHomeTab === 'messages' && renderMessagesTab()}

          {activeHomeTab === 'mine' && renderMineTab()}
      </div>

      {/* Bottom Nav (Hide when searching) */}
      {!isSearching && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around z-50 text-[10px] text-gray-500 py-2 pb-safe-bottom">
            <div 
                onClick={() => setActiveHomeTab('home')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeHomeTab === 'home' ? 'text-gray-900 font-bold' : ''}`}
            >
                <div className={`${activeHomeTab === 'home' ? 'bg-mt-yellow/20' : ''} p-1.5 rounded-full transition-colors`}>
                <Home size={20} className={activeHomeTab === 'home' ? 'text-gray-900' : ''} />
                </div>
                <span>首页</span>
            </div>
            
            <div 
                onClick={() => setActiveHomeTab('orders')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeHomeTab === 'orders' ? 'text-gray-900 font-bold' : ''}`}
            >
                <div className={`${activeHomeTab === 'orders' ? 'bg-mt-yellow/20' : ''} p-1.5 rounded-full transition-colors`}>
                    <ScrollText size={20} className={activeHomeTab === 'orders' ? 'text-gray-900' : ''} />
                </div>
                <span>订单</span>
            </div>

            <div 
                onClick={() => setActiveHomeTab('messages')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeHomeTab === 'messages' ? 'text-gray-900 font-bold' : ''}`}
            >
                <div className={`${activeHomeTab === 'messages' ? 'bg-mt-yellow/20' : ''} p-1.5 rounded-full transition-colors`}>
                    <MessageSquare size={20} className={activeHomeTab === 'messages' ? 'text-gray-900' : ''} />
                </div>
                <span>消息</span>
            </div>

            <div 
                onClick={() => setActiveHomeTab('mine')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeHomeTab === 'mine' ? 'text-gray-900 font-bold' : ''}`}
            >
                <div className={`${activeHomeTab === 'mine' ? 'bg-mt-yellow/20' : ''} p-1.5 rounded-full transition-colors`}>
                    <User size={20} className={activeHomeTab === 'mine' ? 'text-gray-900' : ''} />
                </div>
                <span>我的</span>
            </div>
          </div>
      )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen shadow-2xl overflow-hidden font-sans w-full">
        {currentView === View.HOME && renderHome()}
        {currentView === View.MATCHMAKER_DETAIL && renderDetail()}
        {currentView === View.CANDIDATE_DETAIL && selectedCandidateForDetail && selectedMatchmaker && (
            <CandidateDetail 
                candidate={selectedCandidateForDetail}
                matchmaker={selectedMatchmaker}
                isSelected={selectedCandidates.has(selectedCandidateForDetail.id)}
                onBack={handleBack}
                onToggleInterest={() => handleToggleInterest(selectedCandidateForDetail.id)}
                onConsult={() => handleOpenChat(selectedMatchmaker, false, selectedCandidateForDetail)}
            />
        )}
        {currentView === View.CHAT && renderChat()}
        {currentView === View.ORDER_DETAIL && selectedOrder && (
            <OrderDetail order={selectedOrder} onBack={handleBack} />
        )}
        {currentView === View.MERCHANT_ENTRY && (
            <MerchantEntry onBack={handleBack} />
        )}
        {currentView === View.BLACK_CARD && (
            <BlackCard onBack={handleBack} />
        )}
        {currentView === View.FAVORITE_MATCHMAKERS && (
            <FavoriteMatchmakers 
                onBack={handleBack} 
                onNavigateToMatchmaker={handleMatchmakerClick}
                onConsult={(m) => handleOpenChat(m)}
            />
        )}
        {currentView === View.HISTORY && (
            <History 
                onBack={handleBack}
                onNavigateToCandidate={handleCandidateClick}
                onConsult={(m, c) => handleOpenChat(m, false, c)}
            />
        )}
        {renderPaymentModal()}
    </div>
  );
};

export default App;