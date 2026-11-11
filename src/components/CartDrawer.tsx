import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Store,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalAmount,
    totalItems,
    setIsCheckoutOpen,
  } = useCart();
  const { language, t } = useLanguage();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-200">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {t('yourCart')}
                </h2>
                <span className="text-xs text-slate-500 font-semibold">
                  {totalItems} {language === 'gu' ? 'વસ્તુઓ' : 'items'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                  title="Clear all"
                >
                  {language === 'gu' ? 'ખાલી કરો' : 'Clear'}
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Prominent Shop Pickup Notice Alert */}
          <div className="bg-red-50 border-y border-red-200 p-3.5 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800 font-semibold leading-relaxed">
              <span className="font-bold underline decoration-red-400">
                {t('pickupOnlyNotice')}
              </span>
              <p className="text-[11px] text-red-700 font-normal mt-0.5">
                {t('pickupNoticeDetailed')}
              </p>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">
                    {t('emptyCartMessage')}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    {language === 'gu'
                      ? 'અમૂલ ગોલ્ડ દૂધ, ઘી, માખણ, પનીર અને આઈસ્ક્રીમ કાર્ટમાં ઉમેરો.'
                      : 'Add fresh Amul milk, ghee, butter, paneer, and ice creams to your cart.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all"
                >
                  <span>{t('browseProducts')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-sm"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.nameEn}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80';
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {language === 'gu' ? item.product.nameGu : item.product.nameEn}
                    </h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{item.product.unit}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">₹{item.product.sellingPrice}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-slate-100 border border-slate-300 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-white text-slate-700 hover:text-red-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.availableStock}
                          className="w-6 h-6 flex items-center justify-center rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-sm text-slate-900">
                          ₹{item.product.sellingPrice * item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{t('subtotal')} ({totalItems} items)</span>
                  <span className="font-bold text-slate-900">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{language === 'gu' ? 'દુકાન પિકઅપ ચાર્જ' : 'Shop Pickup Charge'}</span>
                  <span>{language === 'gu' ? 'મફત (₹૦)' : 'FREE (₹0)'}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>{language === 'gu' ? 'કુલ ચૂકવવાપાત્ર રકમ' : 'Grand Total'}</span>
                  <span className="text-red-600 text-lg">₹{totalAmount}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{language === 'gu' ? 'ચુકવણી: દુકાન પર રોકડેથી અથવા UPI સ્કેનથી' : 'Payment: Cash or UPI Scan at counter'}</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-red-200 transition-transform active:scale-98"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
