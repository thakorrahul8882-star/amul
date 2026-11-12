import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, Category, StoreSettings } from './types';
import {
  seedInitialDataIfEmpty,
  subscribeToProducts,
  subscribeToCategories,
  subscribeToStoreSettings,
} from './services/storeService';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PickupNoticeBanner } from './components/PickupNoticeBanner';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { Footer } from './components/Footer';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import {
  Sparkles,
  ShoppingBag,
  Store,
  Layers,
  Search,
  Filter,
  AlertCircle,
  Plus,
} from 'lucide-react';

function MainAppContent() {
  const { language, t } = useLanguage();
  const { isAdmin, user } = useAuth();

  // Navigation: Support URL path '/admin' and in-app route state
  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => {
    return window.location.pathname.startsWith('/admin') ? 'admin' : 'store';
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'featured' | 'new'>('all');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const catalogRef = useRef<HTMLDivElement>(null);

  // Sync route with URL history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(window.location.pathname.startsWith('/admin') ? 'admin' : 'store');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: 'store' | 'admin') => {
    setCurrentView(view);
    const newPath = view === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Seed default Amul catalog (categories & settings) if database is fresh
  useEffect(() => {
    seedInitialDataIfEmpty();

    const unsubProducts = subscribeToProducts((data) => setProducts(data));
    const unsubCategories = subscribeToCategories((data) => setCategories(data));
    const unsubSettings = subscribeToStoreSettings((data) => setStoreSettings(data));

    return () => {
      unsubProducts();
      unsubCategories();
      unsubSettings();
    };
  }, []);

  // Product counts per category
  const productCountByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) {
      map[p.categoryId] = (map[p.categoryId] || 0) + 1;
    }
    return map;
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategoryId && p.categoryId !== selectedCategoryId) {
        return false;
      }
      // Tab filter (Featured / New)
      if (activeFilterTab === 'featured' && !p.isFeatured) {
        return false;
      }
      if (activeFilterTab === 'new' && !p.isNew) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchGu = p.nameGu?.toLowerCase().includes(query);
        const matchEn = p.nameEn?.toLowerCase().includes(query);
        const matchDesc =
          p.descriptionGu?.toLowerCase().includes(query) ||
          p.descriptionEn?.toLowerCase().includes(query);
        const matchCat = p.categoryName?.toLowerCase().includes(query);
        if (!matchGu && !matchEn && !matchDesc && !matchCat) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategoryId, activeFilterTab, searchQuery]);

  // Featured Products slice for home section
  const popularProducts = useMemo(() => {
    return products.filter((p) => p.isFeatured && p.isAvailable);
  }, [products]);

  // New Products slice
  const newArrivals = useMemo(() => {
    return products.filter((p) => p.isNew && p.isAvailable);
  }, [products]);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Render Admin Section
  if (currentView === 'admin') {
    if (!isAdmin) {
      return <AdminLogin onBackToStore={() => navigateTo('store')} />;
    }
    return <AdminDashboard onBackToStore={() => navigateTo('store')} />;
  }

  // Render Customer Website
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 selection:bg-red-600 selection:text-white">
      
      {/* 1. Shop Pickup Banner */}
      <PickupNoticeBanner />

      {/* 2. Brand Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAdminClick={() => navigateTo('admin')}
      />

      {/* 3. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        
        {/* Hero Section */}
        {!searchQuery && selectedCategoryId === null && (
          <HeroBanner onExploreClick={scrollToCatalog} />
        )}

        {/* Categories Bar */}
        <div ref={catalogRef}>
          <CategoryBar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(id) => {
              setSelectedCategoryId(id);
              setActiveFilterTab('all');
            }}
            productCountByCategory={productCountByCategory}
            totalProductsCount={products.length}
          />
        </div>

        {/* Filter Sub-Tabs (All, Popular, New Arrivals) */}
        <div className="flex flex-wrap items-center justify-between gap-3 my-4 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFilterTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                activeFilterTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {language === 'gu' ? 'બધા ઉત્પાદનો' : 'All Items'} ({filteredProducts.length})
            </button>

            <button
              onClick={() => setActiveFilterTab('featured')}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                activeFilterTab === 'featured'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>★</span>
              <span>{t('popularProducts')}</span>
            </button>

            <button
              onClick={() => setActiveFilterTab('new')}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                activeFilterTab === 'new'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('newProducts')}</span>
            </button>
          </div>

          {/* Active selection info */}
          <div className="text-xs text-slate-500 font-medium">
            {selectedCategoryId
              ? categories.find((c) => c.id === selectedCategoryId)?.nameGu
              : language === 'gu'
              ? 'ખોડાણા અમૂલ પાર્લર ડેરી મેનૂ'
              : 'Khodana Dairy Catalog'}
          </div>
        </div>

        {/* Product Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 px-4 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
              {products.length === 0 ? <Store className="w-8 h-8" /> : <Search className="w-8 h-8" />}
            </div>
            
            {products.length === 0 ? (
              <>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {language === 'gu'
                    ? 'અમૂલ પાર્લર ખોડાણા સ્ટોરમાં આપનું સ્વાગત છે!'
                    : 'Welcome to Amul Parlour Khodana!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {language === 'gu'
                    ? 'તમામ ૧૨ કેટેગરીઓ (દૂધ, છાસ, ઘી, માખણ, આઈસ્ક્રીમ, પનીર વગેરે) તૈયાર છે. તમે એડમિન પેનલમાંથી તમારી નવી પ્રોડક્ટ્સ ઉમેરી શકો છો.'
                    : 'All 12 categories are configured and ready. You can now add your custom products from the Admin Panel.'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigateTo('admin')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'gu' ? 'એડમિન પેનલમાં પ્રોડક્ટ ઉમેરો' : 'Add Products in Admin'}</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {language === 'gu'
                    ? 'કોઈ પ્રોડક્ટ મળી નથી'
                    : 'No products found'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {language === 'gu'
                    ? 'તમે શોધેલી વિગત મુજબ કોઈ પ્રોડક્ટ ઉપલબ્ધ નથી. કૃપા કરીને અન્ય નામ અથવા કેટેગરી પસંદ કરો.'
                    : 'Please try searching with a different keyword or reset filters.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategoryId(null);
                    setActiveFilterTab('all');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  {language === 'gu' ? 'બધી પ્રોડક્ટ્સ જુઓ' : 'Reset All Filters'}
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={(p) => setSelectedProductForModal(p)}
              />
            ))}
          </div>
        )}

        {/* Featured Popular Showcase (Only on main view) */}
        {!searchQuery && selectedCategoryId === null && activeFilterTab === 'all' && popularProducts.length > 0 && (
          <div className="my-14 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  {language === 'gu' ? 'ગામના લોકોની પસંદ' : 'Customer Favorites'}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {t('popularProducts')}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {popularProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={`pop-${product.id}`}
                  product={product}
                  onOpenDetails={(p) => setSelectedProductForModal(p)}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 4. Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <OrderTrackingModal />
      <ProductDetailsModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

      {/* 5. Footer */}
      <Footer onAdminClick={() => navigateTo('admin')} />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <MainAppContent />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
