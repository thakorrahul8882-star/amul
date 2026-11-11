import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getWhatsAppClickToChatLink,
  SHOP_WHATSAPP_NUMBER,
} from '../services/whatsappService';
import {
  CheckCircle,
  Copy,
  Printer,
  MessageCircle,
  Store,
  Clock,
  Phone,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, setIsTrackingOpen } = useCart();
  const { language, t } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  if (!lastPlacedOrder) return null;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(lastPlacedOrder.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenTracking = () => {
    setLastPlacedOrder(null);
    setIsTrackingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setLastPlacedOrder(null)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          
          {/* Printable Receipt area */}
          <div id="printable-receipt" className="p-6 space-y-4">
            
            {/* Success Hero Header */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900">
                {t('orderSuccessTitle')}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'gu'
                  ? 'તમારો ઓર્ડર અમૂલ પાર્લર ખોડાણા ખાતે નોંધાઈ ચૂક્યો છે.'
                  : 'Your order is recorded at Amul Parlour Khodana.'}
              </p>
            </div>

            {/* Order ID Banner */}
            <div className="bg-red-50 border-2 border-dashed border-red-300 rounded-2xl p-4 text-center space-y-1">
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">
                {t('orderIdLabel')}
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-red-700 tracking-wider font-mono">
                  {lastPlacedOrder.orderId}
                </span>
                <button
                  onClick={handleCopyOrderId}
                  className="p-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-100 text-xs flex items-center gap-1 shadow-sm"
                  title="Copy Order ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? '✓' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-red-800 font-medium">
                {t('saveOrderIdNote')}
              </p>
            </div>

            {/* Automatic WhatsApp Status Notice */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5">
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900">
                <div className="font-bold flex items-center gap-1">
                  <span>ઓટોમેટીક વોટ્સએપ નોટિફિકેશન</span>
                  <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    SENT
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  દુકાનદારને વોટ્સએપ નંબર <span className="font-bold">{SHOP_WHATSAPP_NUMBER}</span> પર ઓર્ડરની સંપૂર્ણ વિગત આપમેળે મોકલી દેવાઈ છે.
                </p>
              </div>
            </div>

            {/* Pickup Instructions */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Store className="w-4 h-4 text-red-600" />
                <span>{t('pickupInstructions')}</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-slate-900 shrink-0">સ્થળ:</span>
                  <span>અમૂલ પાર્લર ખોડાણા (દૂધ ઉત્પાદક સહકારી મંડળી સંકુલ, મુખ્ય બજાર)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>સમય: સવારે ૬:૦૦ - ૧:૦૦ | સાંજે ૪:૩૦ - ૯:૩૦</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>સંપર્ક: 8849526589</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-red-100/70 border border-red-200 text-[11px] text-red-900 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{t('pickupOnlyNotice')}</span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-slate-800 pb-1 border-b border-slate-100 flex justify-between">
                <span>ઓર્ડર કરેલ વસ્તુઓ</span>
                <span>કુલ: ₹{lastPlacedOrder.totalAmount}</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {lastPlacedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between items-center text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900">{item.nameGu}</span>
                      <span className="text-slate-500 ml-1">× {item.quantity}</span>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-extrabold text-slate-900">
                <span>ચુકવણી પદ્ધતિ:</span>
                <span>
                  {lastPlacedOrder.paymentMethod === 'counter_cash'
                    ? 'દુકાને રોકડ (Cash at Counter)'
                    : 'દુકાને UPI (UPI at Counter)'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              
              {/* Optional direct WhatsApp link */}
              <a
                href={getWhatsAppClickToChatLink(lastPlacedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-colors text-xs sm:text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('whatsappFallbackBtn')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>પ્રિન્ટ રસીદ</span>
                </button>

                <button
                  onClick={handleOpenTracking}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span>{t('trackOrder')}</span>
                </button>
              </div>

              <button
                onClick={() => setLastPlacedOrder(null)}
                className="w-full py-2.5 text-center text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                {t('continueShopping')}
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
