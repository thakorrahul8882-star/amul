import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Order, Product, Category, StoreSettings, OrderStatus } from '../types';
import {
  subscribeToOrders,
  subscribeToProducts,
  subscribeToCategories,
  subscribeToStoreSettings,
  updateOrderStatus,
} from '../services/storeService';
import {
  getCustomerStatusUpdateWhatsAppLink,
  getWhatsAppClickToChatLink,
} from '../services/whatsappService';
import { AdminProductManagement } from './AdminProductManagement';
import { AdminCategoryManagement } from './AdminCategoryManagement';
import { AdminSettings } from './AdminSettings';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  Package,
  Store,
  Phone,
  MessageCircle,
  Search,
  LogOut,
  ExternalLink,
  Printer,
  ChevronDown,
  Layers,
  Settings,
  XCircle,
  AlertCircle,
  RefreshCw,
  BellRing,
} from 'lucide-react';

const STATUS_LIST: { id: OrderStatus; labelGu: string; color: string }[] = [
  { id: 'new', labelGu: '૧. નવો ઓર્ડર (New)', color: 'bg-blue-100 text-blue-800' },
  { id: 'accepted', labelGu: '૨. સ્વીકારાયો (Accepted)', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'preparing', labelGu: '૩. પેકિંગ ચાલુ (Preparing)', color: 'bg-amber-100 text-amber-800' },
  { id: 'ready_for_pickup', labelGu: '૪. પિકઅપ તૈયાર (Ready)', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'completed', labelGu: '૫. પૂર્ણ થયો (Completed)', color: 'bg-slate-100 text-slate-800' },
  { id: 'cancelled', labelGu: '૬. રદ થયો (Cancelled)', color: 'bg-red-100 text-red-800' },
];

export const AdminDashboard: React.FC<{ onBackToStore: () => void }> = ({
  onBackToStore,
}) => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);

  useEffect(() => {
    const unsubOrders = subscribeToOrders((data) => setOrders(data));
    const unsubProducts = subscribeToProducts((data) => setProducts(data));
    const unsubCats = subscribeToCategories((data) => setCategories(data));
    const unsubSettings = subscribeToStoreSettings((data) => setSettings(data));

    return () => {
      unsubOrders();
      unsubProducts();
      unsubCats();
      unsubSettings();
    };
  }, []);

  // Metrics
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const acceptedCount = orders.filter((o) => o.status === 'accepted').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready_for_pickup').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(order.id || order.orderId, newStatus);
    } catch (err) {
      console.error(err);
      alert('સ્ટેટસ અપડેટ કરવામાં ભૂલ આવી.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const cleanSearch = searchQuery.trim().toLowerCase();
    const matchSearch =
      cleanSearch === '' ||
      o.orderId.toLowerCase().includes(cleanSearch) ||
      o.customerName.toLowerCase().includes(cleanSearch) ||
      o.customerMobile.includes(cleanSearch);
    return matchStatus && matchSearch;
  });

  const handlePrintOrder = (o: Order) => {
    setSelectedOrderForPrint(o);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b-2 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex flex-col items-center justify-center text-white font-extrabold shadow-sm border border-red-500">
                <span className="font-serif text-sm">Amul</span>
              </div>
              <div>
                <h1 className="font-extrabold text-sm sm:text-base leading-tight">
                  અમૂલ પાર્લર ખોડાણા - સંચાલક ડેશબોર્ડ
                </h1>
                <p className="text-[11px] text-red-400 font-medium">
                  દૂધ મંડળી દ્વારા સંચાલિત • WhatsApp: 8849526589
                </p>
              </div>
            </div>

            {/* Right Admin Profile & Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onBackToStore}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span>ગ્રાહક સાઇટ જુઓ (View Store)</span>
              </button>

              <div className="hidden md:flex flex-col text-right text-xs">
                <span className="font-bold text-white truncate max-w-[150px]">
                  {user?.email || 'Admin'}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">અધિકૃત સંચાલક</span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-bold transition-all border border-red-600/40"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI Metrics Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">કુલ ઓર્ડર્સ</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-extrabold text-slate-900">{totalOrdersCount}</span>
              <ShoppingBag className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-700 uppercase">નવા ઓર્ડર</span>
              {newOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              )}
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-extrabold text-blue-700">{newOrdersCount}</span>
              <BellRing className="w-4 h-4 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-indigo-200 shadow-sm flex flex-col justify-between">
            <span className="text-[11px] font-bold text-indigo-700 uppercase">સ્વીકારાયા</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-extrabold text-indigo-700">{acceptedCount}</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase">પેકિંગ ચાલુ</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-extrabold text-amber-700">{preparingCount}</span>
              <Package className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm flex flex-col justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">પિકઅપ તૈયાર</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-extrabold text-emerald-700">{readyCount}</span>
              <Store className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">પૂર્ણ થયેલા</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-extrabold text-slate-800">{completedCount}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-red-600 to-red-700 text-white p-3.5 rounded-2xl shadow-md flex flex-col justify-between">
            <span className="text-[11px] font-bold text-red-100 uppercase">કુલ વેચાણ</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-extrabold text-white">₹{totalSales}</span>
              <TrendingUp className="w-4 h-4 text-yellow-300" />
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-red-600 text-white shadow-md shadow-red-200'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ઓર્ડર્સ વ્યવસ્થાપન (Orders)</span>
            <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono">
              {totalOrdersCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'products'
                ? 'bg-red-600 text-white shadow-md shadow-red-200'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>પ્રોડક્ટ્સ (Products)</span>
            <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'categories'
                ? 'bg-red-600 text-white shadow-md shadow-red-200'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>કેટેગરીઝ (Categories)</span>
            <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono">
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'settings'
                ? 'bg-red-600 text-white shadow-md shadow-red-200'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>દુકાન સેટિંગ્સ (Store Settings)</span>
          </button>

        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
              
              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  બધા ({orders.length})
                </button>
                {STATUS_LIST.map((st) => {
                  const count = orders.filter((o) => o.status === st.id).length;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setStatusFilter(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                        statusFilter === st.id
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st.labelGu} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Order ID અથવા મોબાઈલ શોધો..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">કોઈ ઓર્ડર મળ્યો નથી</h3>
                <p className="text-xs text-slate-400">
                  નવા ઓર્ડર આવશે ત્યારે અહીં આપમેળે જોવા મળશે.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const currentStatusConfig =
                    STATUS_LIST.find((s) => s.id === order.status) || STATUS_LIST[0];

                  return (
                    <div
                      key={order.id || order.orderId}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3 hover:border-slate-300 transition-all"
                    >
                      
                      {/* Top Order Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-extrabold text-slate-900 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 text-red-700">
                            {order.orderId}
                          </span>
                          <div>
                            <span className="text-xs text-slate-500 font-medium">
                              {new Date(order.createdAt).toLocaleDateString()} at{' '}
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* Status selector dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                            સ્ટેટસ બદલો:
                          </span>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                            className="py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-100 border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            {STATUS_LIST.map((st) => (
                              <option key={st.id} value={st.id}>
                                {st.labelGu}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Customer Details & Items Row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        
                        {/* Customer Info */}
                        <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-500 uppercase text-[10px]">
                            ગ્રાહકની વિગત
                          </span>
                          <div className="font-bold text-slate-900 text-sm">
                            {order.customerName}
                          </div>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{order.customerMobile}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            ચુકવણી:{' '}
                            <span className="font-bold text-slate-800">
                              {order.paymentMethod === 'counter_cash'
                                ? 'દુકાને રોકડ (Cash)'
                                : 'દુકાને UPI સ્કેન (UPI)'}
                            </span>
                          </div>
                          {order.orderNotes && (
                            <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                              નોંધ: {order.orderNotes}
                            </div>
                          )}
                        </div>

                        {/* Order Items List */}
                        <div className="md:col-span-2 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                          <div>
                            <span className="font-bold text-slate-500 uppercase text-[10px]">
                              ઓર્ડર કરેલ પ્રોડક્ટ્સ ({order.items.length} items)
                            </span>
                            <div className="divide-y divide-slate-200/70 mt-1">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="py-1 flex justify-between text-slate-700">
                                  <div>
                                    <span className="font-bold text-slate-900">{it.nameGu}</span>
                                    <span className="text-slate-500 ml-1">
                                      ({it.unit}) × <span className="font-extrabold text-slate-800">{it.quantity}</span>
                                    </span>
                                  </div>
                                  <span className="font-bold text-slate-900">₹{it.subtotal}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-700">કુલ બિલ (Grand Total):</span>
                            <span className="text-base font-extrabold text-red-600">₹{order.totalAmount}</span>
                          </div>
                        </div>

                      </div>

                      {/* Action Buttons Row */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                        
                        <div className="flex items-center gap-2">
                          {/* Call customer */}
                          <a
                            href={`tel:${order.customerMobile}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                          >
                            <Phone className="w-3.5 h-3.5 text-blue-600" />
                            <span>કૉલ કરો</span>
                          </a>

                          {/* WhatsApp Customer with status update message */}
                          <a
                            href={getCustomerStatusUpdateWhatsAppLink(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200"
                            title="Send order ready notification to customer via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ગ્રાહકને WhatsApp કરો</span>
                          </a>

                          {/* Print Packing Slip */}
                          <button
                            onClick={() => handlePrintOrder(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                            title="Print Counter Slip"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-600" />
                            <span>પ્રિન્ટ સ્લિપ</span>
                          </button>
                        </div>

                        {/* Quick Status Buttons */}
                        <div className="flex items-center gap-1.5">
                          {order.status === 'new' && (
                            <button
                              onClick={() => handleStatusChange(order, 'accepted')}
                              className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                            >
                              સ્વીકારો (Accept)
                            </button>
                          )}
                          {order.status === 'accepted' && (
                            <button
                              onClick={() => handleStatusChange(order, 'preparing')}
                              className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                            >
                              પેકિંગ શરૂ કરો
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => handleStatusChange(order, 'ready_for_pickup')}
                              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                            >
                              પિકઅપ માટે તૈયાર કરો
                            </button>
                          )}
                          {order.status === 'ready_for_pickup' && (
                            <button
                              onClick={() => handleStatusChange(order, 'completed')}
                              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-black text-white text-xs font-bold"
                            >
                              પૂર્ણ થયો (Complete)
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Products Management */}
        {activeTab === 'products' && (
          <AdminProductManagement products={products} categories={categories} />
        )}

        {/* Tab 3: Categories Management */}
        {activeTab === 'categories' && (
          <AdminCategoryManagement categories={categories} />
        )}

        {/* Tab 4: Store Settings */}
        {activeTab === 'settings' && settings && (
          <AdminSettings settings={settings} />
        )}

      </main>

      {/* Hidden Printable Packing Receipt for Counter */}
      {selectedOrderForPrint && (
        <div id="printable-receipt" className="p-8 text-black bg-white max-w-sm mx-auto">
          <div className="text-center pb-3 border-b-2 border-black space-y-1">
            <h2 className="text-xl font-bold font-serif">અમૂલ પાર્લર ખોડાણા</h2>
            <p className="text-xs">દૂધ મંડળી દ્વારા સંચાલિત • Ph: 8849526589</p>
            <p className="text-sm font-mono font-bold mt-1">ORDER ID: {selectedOrderForPrint.orderId}</p>
            <p className="text-[10px]">{new Date(selectedOrderForPrint.createdAt).toLocaleString()}</p>
          </div>

          <div className="py-2 text-xs border-b border-black">
            <div><strong>ગ્રાહક:</strong> {selectedOrderForPrint.customerName}</div>
            <div><strong>મોબાઈલ:</strong> {selectedOrderForPrint.customerMobile}</div>
            <div><strong>ચુકવણી:</strong> {selectedOrderForPrint.paymentMethod === 'counter_cash' ? 'Cash' : 'UPI'}</div>
            {selectedOrderForPrint.orderNotes && <div><strong>નોંધ:</strong> {selectedOrderForPrint.orderNotes}</div>}
          </div>

          <div className="py-2 text-xs">
            <div className="font-bold border-b pb-1 mb-1">આઇટમ યાદી:</div>
            {selectedOrderForPrint.items.map((it, idx) => (
              <div key={idx} className="flex justify-between py-0.5">
                <span>{it.nameGu} × {it.quantity}</span>
                <span>₹{it.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t-2 border-black flex justify-between font-bold text-sm">
            <span>કુલ ચૂકવવાપાત્ર:</span>
            <span>₹{selectedOrderForPrint.totalAmount}</span>
          </div>

          <div className="text-center text-[10px] pt-4 italic">
            *ઓર્ડર દુકાનેથી જ મેળવી શકાશે. હોમ ડિલિવરી નથી.*
          </div>
        </div>
      )}

    </div>
  );
};
