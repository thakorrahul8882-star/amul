import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Languages,
  Clock,
  Phone,
  MessageCircle,
  Truck,
  ShieldAlert,
  ChevronRight,
  Menu,
  X,
  Lock,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAdminClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onAdminClick,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { totalItems, totalAmount, setIsCartOpen, setIsTrackingOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
      {/* Top micro bar with Amul branding touch */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-red-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              અમૂલ - ધ ટેસ્ટ ઓફ ઇન્ડિયા (The Taste of India)
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">ખોડાણા દૂધ ઉત્પાદક સહકારી મંડળી લિ.</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              સવારે ૬:૦૦ - ૧:૦૦ | સાંજે ૪:૩૦ - ૯:૩૦
            </span>
            <a
              href="https://wa.me/918849526589"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp: 8849526589
            </a>
            <button
              onClick={onAdminClick}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              title="Admin Panel"
            >
              <Lock className="w-3 h-3 text-red-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Amul Red Emblem */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-md shadow-red-200 border-2 border-red-700">
              <span className="font-extrabold text-base sm:text-lg leading-none tracking-tight font-serif">
                Amul
              </span>
              <span className="text-[9px] font-bold tracking-widest uppercase text-yellow-300 mt-0.5">
                PARLOUR
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {language === 'gu' ? 'અમૂલ પાર્લર ખોડાણા' : 'Amul Parlour Khodana'}
                </h1>
                <span className="hidden sm:inline-block bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  દૂધ મંડળી
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1">
                <span className="text-red-600 font-semibold">
                  {language === 'gu' ? 'દૂધ મંડળી દ્વારા સંચાલિત' : 'Managed by Dairy Cooperative'}
                </span>
                <span className="hidden md:inline">• ખોડાણા</span>
              </p>
            </div>
          </div>

          {/* Search Box Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
              title="Switch Language"
            >
              <Languages className="w-4 h-4 text-red-600" />
              <span>{language === 'gu' ? 'English' : 'ગુજરાતી'}</span>
            </button>

            {/* Track Order Button */}
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200"
            >
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{t('trackOrder')}</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-md hover:from-red-700 hover:to-red-800 transition-all transform active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-yellow-400 text-slate-900 font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-red-100 uppercase tracking-wider">
                  {t('cart')}
                </span>
                <span className="text-sm font-extrabold text-white">
                  ₹{totalAmount}
                </span>
              </div>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 space-y-2">
            <button
              onClick={() => {
                setIsTrackingOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                {t('trackOrder')}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <a
              href="https://wa.me/918849526589"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp: 8849526589
              </span>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </a>

            <button
              onClick={() => {
                onAdminClick();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                {t('adminLogin')}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
