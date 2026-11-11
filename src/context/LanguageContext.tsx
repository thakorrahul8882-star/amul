import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  gu: {
    // Header & Brand
    storeName: "અમૂલ પાર્લર ખોડાણા",
    storeSubtitle: "દૂધ મંડળી દ્વારા સંચાલિત",
    tagline: "ધ ટેસ્ટ ઓફ ઇન્ડિયા - શુદ્ધ ડેરી ઉત્પાદનો",
    pickupOnlyNotice: "ઓર્ડર દુકાનેથી જ મેળવી શકાશે. હોમ ડિલિવરી ઉપલબ્ધ નથી.",
    pickupNoticeDetailed: "બધા ઓર્ડર અમૂલ પાર્લર ખોડાણા (દૂધ મંડળી) થી જ જાતે આવીને મેળવવાના રહેશે.",
    searchPlaceholder: "પ્રોડક્ટ શોધો (દૂધ, ઘી, માખણ, પનીર, આઈસ્ક્રીમ...)",
    cart: "કાર્ટ",
    trackOrder: "ઓર્ડર ટ્રેકિંગ",
    adminLogin: "એડમિન લોગીન",
    contactUs: "સંપર્ક કરો",
    whatsapp: "વોટ્સએપ",

    // Banner & Badges
    freshDaily: "દરરોજ તાજું દૂધ અને ડેરી પ્રોડક્ટ્સ",
    timings: "દૂધ મંડળી સમય: સવારે ૬:૦૦ થી ૧:૦૦ | સાંજે ૪:૩૦ થી ૯:૩૦",
    shopAddress: "ખોડાણા દૂધ મંડળી સંકુલ, ખોડાણા",
    allCategories: "બધી કેટેગરી",
    popularProducts: "લોકપ્રિય પ્રોડક્ટ્સ (Popular)",
    newProducts: "નવી પ્રોડક્ટ્સ (New)",
    featured: "ખાસ પસંદગી",
    inStock: "સ્ટોક ઉપલબ્ધ",
    outOfStock: "સ્ટોક ખાલી છે",
    stockUnits: "યુનિટ બાકી",

    // Product Card
    addToCart: "કાર્ટમાં ઉમેરો",
    added: "ઉમેરાઈ ગયું ✓",
    viewDetails: "વિગત જુઓ",
    sellingPrice: "ભાવ",
    mrp: "MRP",
    save: "બચત",

    // Cart
    yourCart: "તમારી શોપિંગ કાર્ટ",
    emptyCartMessage: "તમારી કાર્ટ ખાલી છે. અમૂલની તાજી પ્રોડક્ટ્સ પસંદ કરો!",
    browseProducts: "પ્રોડક્ટ્સ જુઓ",
    subtotal: "કુલ રકમ",
    totalItems: "કુલ પ્રોડક્ટ્સ",
    checkout: "ઓર્ડર આગળ વધારો",
    pickupNote: "નોંધ: ઓર્ડર તૈયાર થયા બાદ દુકાનેથી પિકઅપ કરવાનો રહેશે.",

    // Checkout
    checkoutTitle: "ઓર્ડર કન્ફર્મ કરો (દુકાન પિકઅપ)",
    customerName: "ગ્રાહકનું પૂરું નામ",
    customerNamePlaceholder: "દા.ત. રાહુલ પટેલ",
    mobileNumber: "મોબાઈલ નંબર (૧૦ અંક)",
    mobilePlaceholder: "દા.ત. 9876543210",
    orderNotes: "વિશેષ નોંધ (વૈકલ્પિક)",
    orderNotesPlaceholder: "દા.ત. સાંજે ૬ વાગ્યે આવીને લઈ જઈશ",
    paymentMethod: "ચુકવણી પદ્ધતિ",
    cashAtCounter: "દુકાન પર રોકડેથી (Cash at Counter)",
    upiAtCounter: "દુકાન પર UPI / QR કોડથી (UPI at Counter)",
    placeOrderBtn: "ઓર્ડર બુક કરો",
    placingOrder: "ઓર્ડર પ્રોસેસ થઈ રહ્યો છે...",

    // Order Success
    orderSuccessTitle: "ઓર્ડર સફળતાપૂર્વક નોંધાઈ ગયો છે!",
    orderIdLabel: "ઓર્ડર નંબર (Order ID)",
    whatsappNotifiedText: "દુકાનદારને વોટ્સએપ પર આપમેળે જાણ થઈ ગઈ છે (8849526589)",
    whatsappFallbackBtn: "વોટ્સએપ પર ઓર્ડર વિગતો મોકલો",
    pickupInstructions: "ઓર્ડર પિકઅપ સૂચના:",
    pickupAddressTitle: "પિકઅપ સરનામું:",
    saveOrderIdNote: "કૃપા કરીને આ Order ID સાચવી રાખો. દુકાન પર આવીને આ નંબર બતાવવાનો રહેશે.",
    continueShopping: "નવો ઓર્ડર / હોમપેજ",

    // Tracking
    trackOrderTitle: "ઓર્ડર સ્ટેટસ ચેક કરો",
    trackOrderSubtitle: "તમારો Order ID અને મોબાઈલ નંબર દાખલ કરો",
    enterOrderId: "Order ID દાખલ કરો (દા.ત. #AMUL1001)",
    enterMobile: "મોબાઈલ નંબર દાખલ કરો",
    checkStatusBtn: "સ્ટેટસ જુઓ",
    statusNew: "ઓર્ડર મળ્યો છે (New Order)",
    statusAccepted: "ઓર્ડર સ્વીકારાયો છે (Accepted)",
    statusPreparing: "પેકિંગ ચાલુ છે (Preparing)",
    statusReady: "પિકઅપ માટે તૈયાર છે (Ready for Pickup)",
    statusCompleted: "ઓર્ડર પૂર્ણ થયો (Completed)",
    statusCancelled: "ઓર્ડર રદ થયો (Cancelled)",

    // Footer
    aboutTitle: "અમૂલ પાર્લર ખોડાણા વિશે",
    aboutText: "ખોડાણા દૂધ ઉત્પાદક સહકારી મંડળી દ્વારા સંચાલિત અધિકૃત અમૂલ પાર્લર. અમે ગામ અને આસપાસના વિસ્તારના લોકોને અમૂલના ૧૦૦% શુદ્ધ, તાજા અને ગુણવત્તાયુક્ત ડેરી ઉત્પાદનો પૂરા પાડીએ છીએ.",
    quickLinks: "ઝડપી લિંક્સ",
    shopTimingsTitle: "દુકાનનો સમય",
    disclaimerText: "મહત્વપૂર્ણ: આ માત્ર દુકાન પિકઅપ સેવા છે. કોઈ પણ પ્રકારની હોમ ડિલિવરી કરવામાં આવતી નથી.",
  },
  en: {
    // Header & Brand
    storeName: "Amul Parlour Khodana",
    storeSubtitle: "Managed by Milk Cooperative Society",
    tagline: "The Taste of India - Pure Dairy Products",
    pickupOnlyNotice: "Orders must be collected from the shop. Home delivery is NOT available.",
    pickupNoticeDetailed: "All orders must be personally collected from Amul Parlour Khodana (Milk Society).",
    searchPlaceholder: "Search products (Milk, Ghee, Butter, Paneer, Ice Cream...)",
    cart: "Cart",
    trackOrder: "Track Order",
    adminLogin: "Admin Login",
    contactUs: "Contact Us",
    whatsapp: "WhatsApp",

    // Banner & Badges
    freshDaily: "Fresh Daily Milk & Amul Dairy Products",
    timings: "Milk Society Timings: 6:00 AM - 1:00 PM | 4:30 PM - 9:30 PM",
    shopAddress: "Milk Cooperative Campus, Khodana",
    allCategories: "All Categories",
    popularProducts: "Popular Products",
    newProducts: "New Products",
    featured: "Featured",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    stockUnits: "units left",

    // Product Card
    addToCart: "Add to Cart",
    added: "Added ✓",
    viewDetails: "View Details",
    sellingPrice: "Price",
    mrp: "MRP",
    save: "Save",

    // Cart
    yourCart: "Your Shopping Cart",
    emptyCartMessage: "Your cart is empty. Explore fresh Amul products!",
    browseProducts: "Browse Products",
    subtotal: "Subtotal",
    totalItems: "Total Items",
    checkout: "Proceed to Checkout",
    pickupNote: "Note: Orders must be picked up from the shop counter.",

    // Checkout
    checkoutTitle: "Confirm Order (Shop Pickup)",
    customerName: "Customer Full Name",
    customerNamePlaceholder: "e.g. Rahul Patel",
    mobileNumber: "Mobile Number (10 digits)",
    mobilePlaceholder: "e.g. 9876543210",
    orderNotes: "Special Notes (Optional)",
    orderNotesPlaceholder: "e.g. Will pick up around 6:00 PM",
    paymentMethod: "Payment Method",
    cashAtCounter: "Cash at Shop Counter",
    upiAtCounter: "UPI / QR at Shop Counter",
    placeOrderBtn: "Place Order Now",
    placingOrder: "Processing your order...",

    // Order Success
    orderSuccessTitle: "Order Placed Successfully!",
    orderIdLabel: "Order ID",
    whatsappNotifiedText: "Shop owner automatically notified on WhatsApp (8849526589)",
    whatsappFallbackBtn: "Send Order Details via WhatsApp",
    pickupInstructions: "Shop Pickup Instructions:",
    pickupAddressTitle: "Pickup Location:",
    saveOrderIdNote: "Please save this Order ID to show at the shop counter during pickup.",
    continueShopping: "Continue Shopping",

    // Tracking
    trackOrderTitle: "Track Your Order",
    trackOrderSubtitle: "Enter your Order ID and registered mobile number",
    enterOrderId: "Enter Order ID (e.g. #AMUL1001)",
    enterMobile: "Enter Mobile Number",
    checkStatusBtn: "Check Status",
    statusNew: "New Order",
    statusAccepted: "Accepted",
    statusPreparing: "Preparing & Packing",
    statusReady: "Ready for Pickup",
    statusCompleted: "Completed",
    statusCancelled: "Cancelled",

    // Footer
    aboutTitle: "About Amul Parlour Khodana",
    aboutText: "Authorized Amul Parlour operated by the Khodana Milk Producers Cooperative Society. Providing 100% pure, authentic, and fresh Amul dairy delicacies directly to our community.",
    quickLinks: "Quick Links",
    shopTimingsTitle: "Shop Timings",
    disclaimerText: "IMPORTANT: This is strictly a shop pickup service. Home delivery is NOT available.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('amul_language');
    return (saved === 'en' ? 'en' : 'gu') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('amul_language', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'gu' ? 'en' : 'gu');
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['gu'][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
