import { Matchmaker, ServicePackage, Review, ReviewTag, Order, ChatThread, Message } from './types';

export const CATEGORIES = [
  { id: 'elite_men', name: '优质男神' },
  { id: 'elite_women', name: '白富美' },
  { id: 'overseas', name: '海归精英' },
  { id: 'civil_servant', name: '体制内' },
  { id: 'youth', name: '00后专区' },
];

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'pkg_silver',
    title: '单月体验套餐 • 2次约会',
    price: 588,
    originalPrice: 1288,
    description: '适合初次体验，精准匹配',
    tags: ['随时退', '过期自动退'],
    features: ['实名认证嘉宾', '红娘1对1牵线', '约会指导'],
    salesCount: 1542
  },
  {
    id: 'pkg_gold',
    title: '季度无忧会员 • 6次约会',
    price: 1688,
    originalPrice: 3888,
    description: '90天超长服务期，脱单首选',
    tags: ['超值推荐', '极速退款'],
    features: ['优先匹配优质库', '双向意向确认', '情感咨询1次/月', '不满意免费换人'],
    salesCount: 3201
  },
  {
    id: 'pkg_diamond',
    title: '半年尊享VIP • 无限次约会',
    price: 4999,
    originalPrice: 9999,
    description: '高端定制，直至脱单',
    tags: ['老板推荐', '高端专享'],
    features: ['顶级红娘团队', '背景深度背调', '形象改造建议', '全程恋爱跟踪'],
    salesCount: 856
  }
];

// Reusing some candidate data for order records
const mockCandidate1 = {
    id: 'c1',
    name: '李伟',
    age: 29,
    height: 182,
    job: '技术总监',
    salary: '80万+',
    education: '硕士',
    avatar: 'https://picsum.photos/seed/david/300/300',
    categoryId: 'elite_men',
    tags: ['有房有车', '健身达人'],
    intro: '你好，我是一名互联网技术管理者...'
};

const mockCandidate2 = {
    id: 'c7',
    name: '王磊',
    age: 31,
    height: 185,
    job: '首席建筑师',
    salary: '60万',
    education: '硕士',
    avatar: 'https://picsum.photos/seed/alex/300/300',
    categoryId: 'overseas',
    tags: ['伦敦海归', '艺术气质'],
    intro: '建筑是凝固的音乐...'
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    merchantName: '王大妈金牌红娘工作室',
    merchantAvatar: 'https://picsum.photos/seed/auntiewang/200/200',
    serviceTitle: '季度无忧会员 • 6次约会',
    price: 1688,
    status: 'unused', // Overall status
    date: '2023-11-05 14:30',
    tags: ['随时退', '不满意换人'],
    count: 6,
    usedCount: 1,
    records: [
        {
            id: 'rec_1',
            status: 'planning', // High priority
            statusLabel: '等待见面',
            step: 3, // 1:Matching, 2:Chatting, 3:Meeting, 4:Feedback
            candidate: mockCandidate1,
            date: '2023-11-25 19:00',
            location: '星巴克(科技园店)'
        },
        {
            id: 'rec_2',
            status: 'completed',
            statusLabel: '已完成',
            candidate: mockCandidate2,
            date: '2023-11-10 14:00',
            location: 'Blue Cafe',
            feedback: '男生很有绅士风度，但是共同话题不多，希望能找个更活泼一点的。',
            feedbackTags: ['绅士', '话题少']
        },
        { id: 'rec_3', status: 'unused' },
        { id: 'rec_4', status: 'unused' },
        { id: 'rec_5', status: 'unused' },
        { id: 'rec_6', status: 'unused' },
    ]
  },
   {
    id: 'o2',
    merchantName: '喜缘高端婚恋中心',
    merchantAvatar: 'https://picsum.photos/seed/happyfate/200/200',
    serviceTitle: '单次约会体验',
    price: 299,
    status: 'used',
    date: '2023-10-20 09:15',
    tags: [],
    count: 1,
    usedCount: 1,
    records: [
        {
            id: 'rec_2_1',
            status: 'completed',
            statusLabel: '已完成',
            candidate: { ...mockCandidate1, name: '张先生' },
            date: '2023-10-21 20:00',
            feedback: '非常满意，已经交换微信在聊了。',
            feedbackTags: ['满意', '继续发展']
        }
    ]
  },
  {
    id: 'o3',
    merchantName: '精英私人定制俱乐部',
    merchantAvatar: 'https://picsum.photos/seed/elite/200/200',
    serviceTitle: 'VIP入会资格定金',
    price: 1000,
    status: 'refunded',
    date: '2023-09-10 16:45',
    tags: ['退款成功'],
    count: 1,
    usedCount: 0,
    records: [
        { id: 'rec_3_1', status: 'cancelled' }
    ]
  }
];

export const REVIEW_TAGS: ReviewTag[] = [
  { label: '全部', count: 884, active: true },
  { label: '最新', count: 56 },
  { label: '服务热情', count: 452 },
  { label: '牵手成功', count: 128 },
  { label: '红娘专业', count: 335 },
  { label: '资源优质', count: 210 },
  { label: '带图', count: 88 },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    userName: '小美',
    userAvatar: 'https://picsum.photos/seed/user_lily/100/100',
    rating: 5,
    date: '2023.10.15',
    content: '王大妈真的很专业！给我介绍的几个男嘉宾条件都很符合我的要求。特别是第二个男生，无论是学历还是性格都很合拍。现在已经确立关系了，感觉很有戏，感谢！',
    tags: ['服务热情', '资源优质'],
    reply: '亲爱的，看到您能找到心仪的另一半，我们比谁都开心！祝你们长长久久，早日修成正果~ 记得回来发喜糖哦！'
  },
  {
    id: 'r2',
    userName: 'Jason',
    userAvatar: 'https://picsum.photos/seed/user_jason/100/100',
    rating: 5,
    date: '2023.09.28',
    content: '之前在别家平台被坑过，这里比较靠谱，红娘都是实名认证的，也不会一直催着交钱办卡。推荐的嘉宾信息都很真实，见了一个，虽然没成，但感觉平台很正规。',
    images: ['https://picsum.photos/seed/r_img1/300/300', 'https://picsum.photos/seed/r_img2/300/300'],
    tags: ['红娘专业', '体验好'],
    reply: '感谢您的信任！我们一直坚持真实社交。缘分需要一点点耐心，我们会继续为您留意更合适的嘉宾！'
  },
  {
    id: 'r3',
    userName: '匿名用户',
    userAvatar: 'https://picsum.photos/seed/user_unknown/100/100',
    rating: 4,
    date: '2023.08.10',
    content: '整体体验不错，红娘很有亲和力。就是周末约会的人有点多，门店稍微有点吵。',
    tags: ['环境一般', '服务热情'],
    reply: '抱歉给您带来不好的体验，周末确实是高峰期。下次我们可以帮您预约VIP包间，环境会更安静舒适哦。'
  },
   {
    id: 'r4',
    userName: '陈先生',
    userAvatar: 'https://picsum.photos/seed/user_chen/100/100',
    rating: 5,
    date: '2023.07.05',
    content: '终于脱单了！太不容易了。这里的红娘真的很懂心理学，给了我很多追求女生的建议，不仅仅是介绍对象，更是情感导师。',
    tags: ['牵手成功', '情感导师'],
    reply: '恭喜陈先生！您的真诚和努力我们都看在眼里，祝幸福！'
  }
];

export const MOCK_MATCHMAKERS: Matchmaker[] = [
  {
    id: 'm1',
    name: '王大妈金牌红娘工作室',
    title: '资深情感专家',
    avatar: 'https://picsum.photos/seed/auntiewang/200/200',
    rating: 4.9,
    monthlyOrders: 1204,
    distance: '1.2km',
    deliveryTime: '15分钟',
    intro: '20年从业经验，专注高知群体，牵手成功率极高。',
    isVerified: true,
    isLive: true,
    depositAmount: 50000,
    badges: ['企业认证', '已缴保证金', '金牌商家'],
    tags: [
      { label: '金牌红娘', color: 'yellow-600' },
      { label: '高成功率', color: 'orange-500' },
      { label: '实名认证', color: 'blue-500' },
    ],
    categories: CATEGORIES,
    candidates: [
      {
        id: 'c1',
        name: '李伟',
        age: 29,
        height: 182,
        job: '技术总监',
        salary: '80万+',
        education: '硕士',
        avatar: 'https://picsum.photos/seed/david/300/300',
        categoryId: 'elite_men',
        tags: ['有房有车', '健身达人', '阳光帅气'],
        isLive: true,
        heatValue: 9850,
        activeTimeDesc: '刚刚活跃',
        hometown: '山东青岛',
        zodiac: '狮子座',
        photos: [
          'https://picsum.photos/seed/david/500/500',
          'https://picsum.photos/seed/david_gym/500/500',
          'https://picsum.photos/seed/david_work/500/500'
        ],
        intro: '你好，我是一名互联网技术管理者，平时工作比较忙，但生活规律。喜欢健身、登山和阅读。希望找到一位性格开朗、热爱生活的伴侣，我们可以一起去探索这个世界。',
        requirements: '年龄24-28岁，身高165cm以上，本科学历，性格温柔体贴，有稳定工作。'
      },
      {
        id: 'c2',
        name: '陈婷',
        age: 26,
        height: 168,
        job: '金融分析师',
        salary: '40万+',
        education: '本科',
        avatar: 'https://picsum.photos/seed/sarah/300/300',
        categoryId: 'elite_women',
        tags: ['钢琴十级', '爱旅游', '性格温和'],
        isOnline: true,
        heatValue: 8700,
        activeTimeDesc: '5分钟前活跃',
        hometown: '江苏苏州',
        zodiac: '天秤座',
        photos: [
          'https://picsum.photos/seed/sarah/500/500',
          'https://picsum.photos/seed/sarah_piano/500/500'
        ],
        intro: '我是陈婷，朋友都说我是个典型的江南女子，性格温婉。工作上我严谨认真，生活中我喜欢弹钢琴和烘焙。期待遇到一个成熟稳重、有责任心的他。',
        requirements: '年龄28-35岁，身高175cm以上，有上进心，无不良嗜好，顾家。'
      },
      {
        id: 'c3',
        name: '张明',
        age: 32,
        height: 178,
        job: '公务员',
        salary: '收入稳定',
        education: '博士',
        avatar: 'https://picsum.photos/seed/michael/300/300',
        categoryId: 'civil_servant',
        tags: ['北京户口', '家庭和睦', '父母退休'],
        isOnline: true,
        heatValue: 7600,
        activeTimeDesc: '1小时前活跃',
        hometown: '北京',
        zodiac: '摩羯座',
        intro: '土生土长的北京人，父母都是高校教师，家庭氛围很开明。目前在体制内工作，生活安稳。平时喜欢书法和下围棋。',
        requirements: '学历硕士及以上，工作稳定，孝顺父母，最好也是北京本地或打算长期定居北京。'
      },
       {
        id: 'c4',
        name: '吴倩',
        age: 24,
        height: 165,
        job: 'UI设计师',
        salary: '30万',
        education: '美院毕业',
        avatar: 'https://picsum.photos/seed/jessica/300/300',
        categoryId: 'youth',
        tags: ['二次元', '有创意', '粘人'],
        heatValue: 6500,
        activeTimeDesc: '3天前活跃',
        hometown: '四川成都',
        zodiac: '双鱼座',
        intro: '一枚喜欢二次元的设计师妹子，性格比较活泼，有时候会有点小粘人。喜欢画画、看展、Cosplay。',
        requirements: '喜欢个子高的男生，衣品要好，能接受我的兴趣爱好，最好也喜欢动漫。'
      },
    ],
  },
  {
    id: 'm2',
    name: '喜缘高端婚恋中心',
    title: '心理咨询师',
    avatar: 'https://picsum.photos/seed/happyfate/200/200',
    rating: 4.7,
    monthlyOrders: 856,
    distance: '3.5km',
    deliveryTime: '30分钟',
    intro: '注重三观匹配和性格互补，提供专业情感咨询。',
    isVerified: true,
    depositAmount: 20000,
    badges: ['企业认证', '心理咨询资质'],
    tags: [
      { label: '持证心理师', color: 'purple-500' },
      { label: '严格筛选', color: 'green-500' },
    ],
    categories: CATEGORIES,
    candidates: [
      {
        id: 'c5',
        name: '刘强',
        age: 35,
        height: 180,
        job: '投资银行',
        salary: '200万+',
        education: 'MBA',
        avatar: 'https://picsum.photos/seed/kevin/300/300',
        categoryId: 'elite_men',
        tags: ['商界精英', '环球旅行', '成熟稳重'],
        heatValue: 9200,
        activeTimeDesc: '10分钟前活跃',
        intro: '多年投行工作经历让我养成了严谨的习惯，但也渴望有一个温暖的家。我喜欢旅行，足迹遍布30多个国家。',
        requirements: '知性大方，能够理解我的工作性质，愿意一起探索世界。'
      },
      {
        id: 'c6',
        name: '赵敏',
        age: 28,
        height: 170,
        job: '三甲医生',
        salary: '50万',
        education: '博士',
        avatar: 'https://picsum.photos/seed/emily/300/300',
        categoryId: 'elite_women',
        tags: ['有爱心', '知性', '工作稳定'],
        heatValue: 8900,
        activeTimeDesc: '刚刚活跃',
        intro: '在这个喧嚣的城市里，我希望能找到一份宁静的感情。作为医生，我看惯了生老病死，更加珍惜当下的幸福。',
        requirements: '有责任感，身体健康，无不良嗜好。'
      },
    ],
  },
   {
    id: 'm3',
    name: '精英私人定制俱乐部',
    title: '高端俱乐部',
    avatar: 'https://picsum.photos/seed/elite/200/200',
    rating: 4.8,
    monthlyOrders: 532,
    distance: '5.0km',
    deliveryTime: '1小时',
    intro: '仅限邀请制会员，专注高净值人群婚恋服务。',
    isVerified: false,
    badges: ['邀请制', '高净值'],
    tags: [
      { label: '仅限VIP', color: 'red-500' },
      { label: '背景背调', color: 'blue-600' },
    ],
    categories: CATEGORIES,
    candidates: [
      {
        id: 'c7',
        name: '王磊',
        age: 31,
        height: 185,
        job: '首席建筑师',
        salary: '60万',
        education: '硕士',
        avatar: 'https://picsum.photos/seed/alex/300/300',
        categoryId: 'overseas',
        tags: ['伦敦海归', '艺术气质', '品味好'],
        heatValue: 9900,
        activeTimeDesc: '2小时前活跃',
        intro: '建筑是凝固的音乐，我希望我们的生活也能像乐章一样优美。海归背景让我思维比较开放，但也尊重传统文化。',
        requirements: '有艺术修养，气质佳，聊得来最重要。'
      },
    ],
  },
];

export const MOCK_CHAT_THREADS: ChatThread[] = [
  { 
    id: 't1', 
    matchmakerId: 'm1', 
    unreadCount: 2, 
    lastMessage: '好的，没问题。方便加个微信细聊吗？', 
    lastMessageTime: '12:30',
    isTop: true
  },
  { 
    id: 't2', 
    matchmakerId: 'm2', 
    unreadCount: 0, 
    lastMessage: '赵敏的资料我已经发给您了，请查收。', 
    lastMessageTime: '昨天' 
  },
  { 
    id: 't3', 
    matchmakerId: 'm3', 
    unreadCount: 0, 
    lastMessage: '感谢您的咨询，我们会尽快安排专属顾问联系您。', 
    lastMessageTime: '星期二' 
  }
];

export const MOCK_CHAT_HISTORY: Record<string, Message[]> = {
  'm1': [
      {
          id: 'h1_1',
          sender: 'user',
          type: 'text',
          content: '你好，我看中那位技术总监李伟了',
          time: '12:15'
      },
      {
          id: 'h1_2',
          sender: 'matchmaker',
          type: 'text',
          content: '您好！李伟确实很优秀，很多女嘉宾都对他感兴趣呢。',
          time: '12:16'
      },
      {
          id: 'h1_3',
          sender: 'user',
          type: 'text',
          content: '能安排见个面吗？',
          time: '12:20'
      },
      {
          id: 'h1_4',
          sender: 'matchmaker',
          type: 'text',
          content: '当然可以，不过我们需要先核实一下您的基本信息，确保双方匹配度。',
          time: '12:25'
      },
      {
          id: 'h1_5',
          sender: 'matchmaker',
          type: 'text',
          content: '好的，没问题。方便加个微信细聊吗？',
          time: '12:30'
      }
  ],
  'm2': [
      {
          id: 'h2_1',
          sender: 'matchmaker',
          type: 'text',
          content: '下午好，我是喜缘婚恋的心理咨询师Amy。',
          time: '昨天 14:00'
      },
      {
          id: 'h2_2',
          sender: 'user',
          type: 'text',
          content: '你好，我想找个医生。',
          time: '昨天 14:05'
      },
      {
          id: 'h2_3',
          sender: 'matchmaker',
          type: 'text',
          content: '明白，我们这里有好几位优秀的医生嘉宾。您对年龄有什么要求吗？',
          time: '昨天 14:10'
      },
      {
          id: 'h2_4',
          sender: 'matchmaker',
          type: 'text',
          content: '赵敏的资料我已经发给您了，请查收。',
          time: '昨天 14:15'
      }
  ]
};