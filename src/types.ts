export type Language = 'gu' | 'en';

export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'completed'
  | 'cancelled';

export interface Category {
  id: string;
  nameGu: string;
  nameEn: string;
  slug: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Product {
  id: string;
  nameGu: string;
  nameEn: string;
  categoryId: string;
  categoryName?: string;
  descriptionGu: string;
  descriptionEn: string;
  sellingPrice: number;
  originalPrice?: number;
  availableStock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isNew?: boolean;
  unit: string; // e.g. "500ml", "1L", "200g", "1 Packet"
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  nameGu: string;
  nameEn: string;
  unit: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id?: string;
  orderId: string; // e.g. #AMUL1001
  customerName: string;
  customerMobile: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'counter_cash' | 'counter_upi';
  orderNotes?: string;
  pickupLocation: string;
  createdAt: string;
  updatedAt: string;
  whatsappNotificationStatus?: 'sent' | 'pending' | 'failed' | 'fallback_ready';
}

export interface StoreSettings {
  storeNameGu: string;
  storeNameEn: string;
  storeSubNameGu: string;
  storeSubNameEn: string;
  whatsappNumber: string;
  phone: string;
  addressGu: string;
  addressEn: string;
  village: string;
  taluka: string;
  district: string;
  morningTiming: string;
  eveningTiming: string;
  isOpen: boolean;
  pickupNoticeGu: string;
  pickupNoticeEn: string;
  allowCounterCash: boolean;
  allowCounterUpi: boolean;
  upiId?: string;
  whatsappApiConfigured?: boolean;
  whatsappPhoneNumberId?: string;
  whatsappApiToken?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
}
