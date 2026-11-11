import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  Store,
  ShieldCheck,
  AlertCircle,
  Tag,
} from 'lucide-react';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<Props> = ({ product, onClose }) => {
  const { language, t } = useLanguage();
  const { cart, addToCart, updateQuantity } = useCart();
  const [selectedQty, setSelectedQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isOutOfStock = !product.isAvailable || product.availableStock <= 0;
  const cartItem = cart.find((i) => i.product.id === product.id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedQty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.sellingPrice;
  const savings = hasDiscount
    ? Math.round(product.originalPrice! - product.sellingPrice)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-black flex items-center justify-center shadow-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Image */}
          <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.nameEn}
              className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                <span className="bg-red-600 text-white font-extrabold text-sm px-4 py-1.5 rounded-full">
                  {t('outOfStock')}
                </span>
              </div>
            )}
            <div className="absolute bottom-3 left-4">
              <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1 rounded-xl shadow-md border border-slate-200">
                {product.unit}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                {product.categoryName || 'Amul Dairy'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mt-1">
                {language === 'gu' ? product.nameGu : product.nameEn}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {language === 'gu' ? product.nameEn : product.nameGu}
              </p>
            </div>

            {/* Price section */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">
                  {language === 'gu' ? 'દુકાન પિકઅપ ભાવ' : 'Shop Pickup Price'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">
                    ₹{product.sellingPrice}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {hasDiscount && (
                <div className="bg-red-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm">
                  {language === 'gu' ? `₹${savings} બચત` : `Save ₹${savings}`}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide">
                {language === 'gu' ? 'વિગત અને ગુણવત્તા' : 'Product Details'}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {language === 'gu' ? product.descriptionGu : product.descriptionEn}
              </p>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center justify-between text-xs font-semibold py-1">
              <span className="text-slate-600">સ્ટોક સ્થિતિ:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold ${
                  product.availableStock > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.availableStock > 0
                  ? `${product.availableStock} ${t('stockUnits')}`
                  : t('outOfStock')}
              </span>
            </div>

            {/* Shop Pickup Reminder */}
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 font-semibold flex items-center gap-2">
              <Store className="w-4 h-4 text-red-600 shrink-0" />
              <span>{t('pickupOnlyNotice')}</span>
            </div>

            {/* Quantity and Add to Cart action */}
            {!isOutOfStock && (
              <div className="pt-2 flex items-center gap-3">
                <div className="flex items-center bg-slate-100 border border-slate-300 rounded-2xl p-1">
                  <button
                    onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                    className="w-8 h-8 rounded-xl bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-extrabold text-slate-900">
                    {selectedQty}
                  </span>
                  <button
                    onClick={() => setSelectedQty(Math.min(product.availableStock, selectedQty + 1))}
                    disabled={selectedQty >= product.availableStock}
                    className="w-8 h-8 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg transition-transform active:scale-98 text-sm"
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5 text-yellow-300" />
                      <span>{t('added')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>
                        {t('addToCart')} • ₹{product.sellingPrice * selectedQty}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
