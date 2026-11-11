import React from 'react';
import { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Milk,
  IceCream,
  Package,
  Layers,
  Flame,
  Box,
  Disc,
  CupSoda,
  Sparkles,
  Gift,
  Coffee,
  ShoppingBag,
  Grid,
} from 'lucide-react';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  productCountByCategory: Record<string, number>;
  totalProductsCount: number;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  milk: <Milk className="w-5 h-5" />,
  'ice-cream': <IceCream className="w-5 h-5" />,
  butter: <Package className="w-5 h-5" />,
  cheese: <Layers className="w-5 h-5" />,
  ghee: <Flame className="w-5 h-5" />,
  paneer: <Box className="w-5 h-5" />,
  curd: <Disc className="w-5 h-5" />,
  buttermilk: <CupSoda className="w-5 h-5" />,
  shrikhand: <Sparkles className="w-5 h-5" />,
  chocolates: <Gift className="w-5 h-5" />,
  beverages: <Coffee className="w-5 h-5" />,
  other: <ShoppingBag className="w-5 h-5" />,
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  productCountByCategory,
  totalProductsCount,
}) => {
  const { language, t } = useLanguage();

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-red-600 rounded-full inline-block"></span>
          <span>{language === 'gu' ? 'પ્રોડક્ટ કેટેગરીઝ' : 'Product Categories'}</span>
        </h2>
        {selectedCategoryId && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-bold text-red-600 hover:text-red-700 underline"
          >
            {language === 'gu' ? 'બધી જુઓ (Reset)' : 'View All'}
          </button>
        )}
      </div>

      {/* Horizontal scrolling bar for all screen sizes */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        
        {/* All Products button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 shadow-sm ${
            selectedCategoryId === null
              ? 'bg-red-600 text-white shadow-red-200 border-2 border-red-700'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>{t('allCategories')}</span>
          <span
            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
              selectedCategoryId === null
                ? 'bg-red-800 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {totalProductsCount}
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const icon = ICON_MAP[cat.slug] || <ShoppingBag className="w-4 h-4" />;
          const count = productCountByCategory[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 shadow-sm ${
                isSelected
                  ? 'bg-red-600 text-white shadow-red-200 border-2 border-red-700'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className={isSelected ? 'text-yellow-300' : 'text-red-600'}>
                {icon}
              </span>
              <span>{language === 'gu' ? cat.nameGu : cat.nameEn}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-red-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}

      </div>
    </div>
  );
};
