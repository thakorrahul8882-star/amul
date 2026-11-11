import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { findOrderByTracking } from '../services/storeService';
import { Order, OrderStatus } from '../types';
import {
  X,
  Search,
  Clock,
  CheckCircle,
  Package,
  Store,
  Phone,
  AlertCircle,
  XCircle,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

const STATUS_STEPS: { status: OrderStatus; labelGu: string; labelEn: string }[] = [
  { status: 'new', labelGu: 'ઓર્ડર મળ્યો', labelEn: 'New Order' },
  { status: 'accepted', labelGu: 'સ્વીકારાયો', labelEn: 'Accepted' },
  { status: 'preparing', labelGu: 'પેકિંગ ચાલુ', labelEn: 'Preparing' },
  { status: 'ready_for_pickup', labelGu: 'પિકઅપ માટે તૈયાર', labelEn: 'Ready for Pickup' },
  { status: 'completed', labelGu: 'પૂર્ણ થયો', labelEn: 'Completed' },
];

export const OrderTrackingModal: React.FC = () => {
  const { isTrackingOpen, setIsTrackingOpen } = useCart();
  const { language, t } = useLanguage();

  const [orderIdInput, setOrderIdInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isTrackingOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSearchedOrder(null);

    const cleanId = orderIdInput.trim();
    const cleanMobile = mobileInput.trim();

    if (!cleanId) {
      setErrorMessage(language === 'gu' ? 'કૃપા કરીને Order ID દાખલ કરો.' : 'Please enter Order ID.');
      return;
    }
    if (!cleanMobile || cleanMobile.length < 4) {
      setErrorMessage(language === 'gu' ? 'કૃપા કરીને મોબાઈલ નંબર દાખલ કરો.' : 'Please enter mobile number.');
      return;
    }

    setLoading(true);
    try {
      const order = await findOrderByTracking(cleanId, cleanMobile);
      if (order) {
        setSearchedOrder(order);
      } else {
        setErrorMessage(
          language === 'gu'
            ? 'આ Order ID અને મોબાઈલ નંબર સાથે કોઈ ઓર્ડર મળ્યો નથી. વિગતો ચકાસો.'
            : 'No order found matching this Order ID and mobile number.'
        );
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(language === 'gu' ? 'ઓર્ડર શોધવામાં ભૂલ આવી.' : 'Error fetching order.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    return STATUS_STEPS.findIndex((s) => s.status === status);
  };

  const currentStep = searchedOrder ? getCurrentStepIndex(searchedOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsTrackingOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl">
                  {t('trackOrderTitle')}
                </h3>
                <p className="text-xs text-blue-200">
                  {t('trackOrderSubtitle')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsTrackingOpen(false)}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            
            {/* Search Input Form */}
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'gu' ? 'Order ID' : 'Order ID'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. #AMUL1001"
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'gu' ? 'મોબાઈલ નંબર' : 'Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-98"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{t('checkStatusBtn')}</span>
                  </>
                )}
              </button>
            </form>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Found Order Card */}
            {searchedOrder && (
              <div className="space-y-4 pt-2 border-t border-slate-200 animate-in fade-in duration-200">
                
                {/* Status Hero Badge */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Order ID</span>
                    <h4 className="text-xl font-extrabold text-slate-900 font-mono">
                      {searchedOrder.orderId}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(searchedOrder.createdAt).toLocaleDateString()} at{' '}
                      {new Date(searchedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">વર્તમાન સ્થિતિ</span>
                    <div>
                      {searchedOrder.status === 'cancelled' ? (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-extrabold px-3 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{t('statusCancelled')}</span>
                        </span>
                      ) : searchedOrder.status === 'ready_for_pickup' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full animate-bounce">
                          <Store className="w-3.5 h-3.5" />
                          <span>{t('statusReady')}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full">
                          <Package className="w-3.5 h-3.5" />
                          <span>
                            {STATUS_STEPS.find((s) => s.status === searchedOrder.status)?.labelGu ||
                              searchedOrder.status}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Stepper (if not cancelled) */}
                {searchedOrder.status !== 'cancelled' && (
                  <div className="py-2">
                    <div className="relative flex items-center justify-between">
                      {/* Connection Line */}
                      <div className="absolute left-4 right-4 top-4 h-1 bg-slate-200 -z-0">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{
                            width: `${(Math.max(0, currentStep) / (STATUS_STEPS.length - 1)) * 100}%`,
                          }}
                        />
                      </div>

                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={step.status} className="flex flex-col items-center z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                                isDone
                                  ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                                  : 'bg-white text-slate-400 border-2 border-slate-300'
                              }`}
                            >
                              {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] font-bold mt-1.5 text-center max-w-[60px] leading-tight ${
                                isCurrent ? 'text-slate-900 font-extrabold' : 'text-slate-500'
                              }`}
                            >
                              {language === 'gu' ? step.labelGu : step.labelEn}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pickup Instructions Callout */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-amber-700" />
                    <span>પિકઅપ સરનામું: અમૂલ પાર્લર ખોડાણા (દૂધ મંડળી સંકુલ)</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    દુકાને આવીને આ Order ID ({searchedOrder.orderId}) બતાવો. હોમ ડિલિવરી ઉપલબ્ધ નથી.
                  </p>
                </div>

                {/* Ordered Items Breakdown */}
                <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="font-bold text-slate-800 flex justify-between">
                    <span>ઓર્ડર કરેલી વસ્તુઓ</span>
                    <span className="text-red-600 font-extrabold">કુલ: ₹{searchedOrder.totalAmount}</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {searchedOrder.items.map((it, i) => (
                      <div key={i} className="py-1 flex justify-between text-slate-700">
                        <span>
                          {it.nameGu} × {it.quantity}
                        </span>
                        <span className="font-semibold text-slate-900">₹{it.subtotal}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
