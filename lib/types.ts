export type Category =
  | "Electronics"
  | "Vehicles"
  | "Real Estate"
  | "Fashion"
  | "Food & Beverage"
  | "Services"
  | "Home & Garden"
  | "Sports & Outdoors";

export type ListingCondition = "New" | "Like New" | "Good" | "Fair";

export type ListingTier = "free" | "featured" | "premium";

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  isPro?: boolean;
  businessName?: string;
  banner?: string;
  bio?: string;
  listingCount?: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: "TTD" | "USD";
  category: Category;
  condition: ListingCondition;
  location: string;
  images: string[];
  seller: Seller;
  createdAt: string;
  featured: boolean;
  tier: ListingTier;
  tags: string[];
  negotiable: boolean;
  commentCount?: number;
  views?: number;
  sold?: boolean;
}

export interface Inquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  buyerEmail: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Comment {
  id: string;
  listingId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  replies: CommentReply[];
}

export interface CommentReply {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingPrice: string;
  messages: Message[];
  unread: number;
}

export interface WalletTransaction {
  id: string;
  type: "topup" | "spend";
  amount: number;
  description: string;
  date: string;
}
