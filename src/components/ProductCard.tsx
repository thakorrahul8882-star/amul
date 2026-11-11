import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Plus, Minus, ShoppingBag, Check, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
}) => {
  const { language, t } = useLanguage();
  const { cart, addToCart, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;
  const isOutOfStock = !product.isAvailable || product.availableStock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantityInCart < product.availableStock) {
      updateQuantity(product.id, quantityInCart + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantityInCart - 1);
  };

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.sellingPrice;
  const savings = hasDiscount
    ? Math.round(product.originalPrice! - product.sellingPrice)
    : 0;

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(product)}
      className="group relative bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Media & Badges Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.nameEn}
          loading="lazy"
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? 'grayscale opacity-60' : ''
          }`}
          onError={(e) => {
            // Fallback image if unsplash breaks
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Badges on top of image */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
          {product.isFeatured && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
              ★ {language === 'gu' ? 'લોકપ્રિય' : 'Popular'}
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
              {language === 'gu' ? 'નવું' : 'New'}
            </span>
          )}
        </div>

        {/* Savings Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
            {language === 'gu' ? `₹${savings} બચત` : `Save ₹${savings}`}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="bg-red-600 text-white font-extrabold text-xs sm:text-sm px-3.5 py-1 rounded-full shadow-lg">
              {t('outOfStock')}
            </span>
          </div>
        )}

        {/* Unit Tag at bottom of image */}
        <div className="absolute bottom-2.5 left-3">
          <span className="bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-lg border border-slate-200/80 shadow-sm">
            {product.unit}
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Category Tag */}
          <div className="text-[11px] font-semibold text-red-600 uppercase tracking-wider mb-1">
            {product.categoryName || 'Amul Dairy'}
          </div>

          {/* Primary Name (Gujarati) */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
            {language === 'gu' ? product.nameGu : product.nameEn}
          </h3>

          {/* Secondary Name */}
          <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
            {language === 'gu' ? product.nameEn : product.nameGu}
          </p>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {language === 'gu' ? product.descriptionGu : product.descriptionEn}
          </p>
        </div>

        {/* Low Stock Warning */}
        {!isOutOfStock && product.availableStock <= 8 && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>
              {language === 'gu'
                ? `માત્ર ${product.availableStock} બાકી!`
                : `Only ${product.availableStock} left!`}
            </span>
          </div>
        )}

        {/* Price & Add to Cart action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                ₹{product.sellingPrice}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {language === 'gu' ? 'દુકાન પિકઅપ ભાવ' : 'Shop Pickup Price'}
            </div>
          </div>

          {/* Cart Buttons */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed"
              >
                {language === 'gu' ? 'ઉપલબ્ધ નથી' : 'Unavailable'}
              </button>
            ) : quantityInCart === 0 ? (
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-200 transition-all"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-yellow-300" />
                    <span>{t('added')}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>{t('addToCart')}</span>
                  </>
                )}
              </button>
            ) : (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-slate-100 border border-slate-300 rounded-xl p-0.5 shadow-inner"
              >
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs sm:text-sm font-extrabold text-slate-900">
                  {quantityInCart}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={quantityInCart >= product.availableStock}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 transition-colors shadow-sm"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
