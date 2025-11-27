export interface User {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  walletBalance: number;
}

export interface Method {
  id: string;
  name: string;
  thumbnail?: string;
  views: number;
  date: string;
}

export interface Creator {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

export interface ChatGroup {
  id: string;
  name: string;
  memberCount: number;
  coverImage?: string;
  members: Creator[];
  messages: Message[];
}

export interface Payout {
  id: string;
  amount: number;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
}

export interface Stats {
  totalEarnings: number;
  rank: number;
  totalCreators: number;
  percentile: number;
  methods: Method[];
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'payout' | 'trending' | 'message' | 'general';
  timestamp: Date;
  read: boolean;
}

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  PhoneAuth: undefined;
  NotificationPermission: undefined;
  MainTabs: undefined;
  MethodStats: { methodId: string };
  Chat: { groupId: string };
};

export type MainTabParamList = {
  Explore: undefined;
  Analytics: undefined;
  Ideas: undefined;
  Account: undefined;
};
