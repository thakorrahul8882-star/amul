import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { createOrder } from '../services/storeService';
import { sendAutomaticWhatsAppNotification } from '../services/whatsappService';
import {
  X,
  Store,
  AlertCircle,
  Phone,
  User,
  CreditCard,
  FileText,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    totalAmount,
    totalItems,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    setLastPlacedOrder,
  } = useCart();
  const { language, t } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'counter_cash' | 'counter_upi'>('counter_cash');
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = customerName.trim();
    const cleanMobile = customerMobile.replace(/\D/g, '');

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage(language === 'gu' ? 'કૃપા કરીને પૂરું નામ દાખલ કરો.' : 'Please enter your full name.');
      return;
    }

    if (cleanMobile.length !== 10) {
      setErrorMessage(
        language === 'gu'
          ? 'કૃપા કરીને માન્ય ૧૦ અંકનો મોબાઈલ નંબર દાખલ કરો.'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    if (cart.length === 0) {
      setErrorMessage(language === 'gu' ? 'કાર્ટ ખાલી છે.' : 'Your cart is empty.');
      return;
    }

    setLoading(true);

    try {
      // 1. Submit order to database (validates prices and updates stock atomically)
      const newOrder = await createOrder({
        customerName: trimmedName,
        customerMobile: cleanMobile,
        items: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        paymentMethod,
        orderNotes: orderNotes.trim(),
      });

      // 2. Dispatch automatic WhatsApp notification to shop owner (8849526589)
      try {
        await sendAutomaticWhatsAppNotification(newOrder);
      } catch (waErr) {
        console.warn('Automatic WhatsApp trigger completed with notice:', waErr);
      }

      // 3. Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // 4. Update state and open success modal
      setLastPlacedOrder(newOrder);
      clearCart();
      setIsCheckoutOpen(false);
    } catch (err: unknown) {
      console.error('Order creation error:', err);
      const msg = err instanceof Error ? err.message : 'ઓર્ડર નોંધવામાં ભૂલ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => !loading && setIsCheckoutOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Store className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl">
                  {t('checkoutTitle')}
                </h3>
                <p className="text-xs text-red-100">
                  {language === 'gu' ? 'અમૂલ પાર્લર ખોડાણા (દૂધ મંડળી)' : 'Amul Parlour Khodana (Milk Society)'}
                </p>
              </div>
            </div>

            <button
              disabled={loading}
              onClick={() => setIsCheckoutOpen(false)}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Strict Pickup Notice Banner */}
          <div className="bg-red-50 border-b border-red-200 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-900 leading-relaxed">
              <span className="font-bold underline decoration-red-400">
                {t('pickupOnlyNotice')}
              </span>
              <p className="text-[11px] text-red-700 font-medium mt-1">
                {language === 'gu'
                  ? 'કોઈ પણ સંજોગોમાં હોમ ડિલિવરી કરવામાં આવશે નહીં. તમામ ઓર્ડર દુકાન પર આવીને જાતે જ મેળવવાના રહેશે.'
                  : 'Home delivery is strictly not available. You must collect your order in person from the parlour.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-4">
            
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-100 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('customerName')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t('customerNamePlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Customer Mobile */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('mobileNumber')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('mobilePlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {language === 'gu'
                  ? 'આ નંબર પર તમને ઓર્ડર સ્ટેટસની જાણ કરવામાં આવશે.'
                  : 'Order updates and pickup alerts will be sent to this mobile number.'}
              </p>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('paymentMethod')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                <label
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'counter_cash'
                      ? 'border-red-600 bg-red-50/60 ring-2 ring-red-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="counter_cash"
                    checked={paymentMethod === 'counter_cash'}
                    onChange={() => setPaymentMethod('counter_cash')}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {t('cashAtCounter')}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {language === 'gu' ? 'દુકાને રોકડા ચૂકવો' : 'Pay cash at parlour'}
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'counter_upi'
                      ? 'border-red-600 bg-red-50/60 ring-2 ring-red-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="counter_upi"
                    checked={paymentMethod === 'counter_upi'}
                    onChange={() => setPaymentMethod('counter_upi')}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {t('upiAtCounter')}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {language === 'gu' ? 'GPay / PhonePe / Paytm' : 'Scan QR at shop'}
                    </div>
                  </div>
                </label>

              </div>
            </div>

            {/* Order Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('orderNotes')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={150}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={t('orderNotesPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Order Summary Snapshot */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
                <span>{language === 'gu' ? 'પસંદ કરેલ પ્રોડક્ટ્સ' : 'Selected Products'}:</span>
                <span className="font-bold text-slate-900">{totalItems} {language === 'gu' ? 'નંગ' : 'items'}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>{language === 'gu' ? 'કુલ ચૂકવવાપાત્ર રકમ' : 'Grand Total'}:</span>
                <span className="text-red-600 text-lg">₹{totalAmount}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-98"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{t('placingOrder')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-yellow-300" />
                  <span>{t('placeOrderBtn')} • ₹{totalAmount}</span>
                </>
              )}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};
