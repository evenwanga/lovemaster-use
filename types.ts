export interface Tag {
  label: string;
  color: string; // Tailwind color class suffix (e.g., 'red-500')
}

export interface ServicePackage {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  description: string;
  tags: string[];
  features: string[]; // e.g. ["实名认证", "双向奔赴", "不满意包换"]
  salesCount: number;
}

export type ServiceStatus = 'unused' | 'planning' | 'confirmed' | 'completed' | 'cancelled';

export interface ServiceRecord {
  id: string;
  status: ServiceStatus;
  statusLabel?: string; // e.g. "对方已接受", "等待见面"
  step?: number; // 1-4 for progress bar
  candidate?: Candidate;
  date?: string;
  location?: string;
  feedback?: string;
  feedbackTags?: string[];
}

export interface Order {
  id: string;
  merchantName: string;
  merchantAvatar: string;
  serviceTitle: string;
  price: number;
  status: 'used' | 'unused' | 'refunded'; // Summary status
  date: string; // Purchase date
  tags: string[]; 
  count: number; // Total count
  usedCount: number;
  records: ServiceRecord[]; // Detailed equity records
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  content: string;
  images?: string[];
  reply?: string;
  tags?: string[];
}

export interface ReviewTag {
  label: string;
  count: number;
  active?: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  age: number;
  height: number;
  job: string;
  salary: string;
  education: string;
  avatar: string;
  tags: string[];
  categoryId: string;
  isLive?: boolean;
  isOnline?: boolean;
  // New fields
  heatValue?: number; // e.g. 9500
  activeTimeDesc?: string; // e.g. "刚刚活跃", "30分钟前活跃"
  
  // Detail page fields
  photos?: string[];
  hometown?: string;
  zodiac?: string;
  intro?: string;
  requirements?: string;
}

export interface Category {
  id: string;
  name: string;
  age?: number; 
}

export interface Matchmaker {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  monthlyOrders: number;
  distance: string;
  deliveryTime: string; // Used as "Response Time"
  tags: Tag[];
  categories: Category[];
  candidates: Candidate[];
  intro: string;
  // New merchant fields
  isVerified: boolean;
  depositAmount?: number;
  badges: string[]; // e.g., "Enterprise", "Gold Medal"
  isLive?: boolean;
}

// Chat Message Interface
export interface Message {
  id: string;
  sender: 'user' | 'matchmaker' | 'system';
  type: 'text' | 'card' | 'image';
  content: string;
  cardData?: {
    count: number;
    candidates: Candidate[];
    title: string;
  };
  time: string;
}

export interface ChatThread {
  id: string;
  matchmakerId: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  isTop?: boolean;
}