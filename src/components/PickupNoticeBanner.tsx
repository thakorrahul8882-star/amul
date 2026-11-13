import React from 'react';
import { AlertCircle, Store, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const PickupNoticeBanner: React.FC = () => {
  const { t, language } = useLanguage();
  const settings = useStoreSettings();

  const noticeText =
    language === 'gu'
      ? settings.pickupNoticeGu || t('pickupOnlyNotice')
      : settings.pickupNoticeEn || t('pickupOnlyNotice');
  const phoneDisplay = settings.whatsappNumber || settings.phone || '8849526589';
  const cleanPhone = phoneDisplay.replace(/\D/g, '');

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-md border-b-2 border-red-900">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm font-medium">
          
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-flex items-center justify-center p-1 rounded-full bg-white/20 text-yellow-300 animate-pulse shrink-0">
              <AlertCircle className="w-4 h-4" />
            </span>
            <div className="leading-tight">
              <span className="font-bold text-yellow-300 uppercase tracking-wide">
                {language === 'gu' ? 'મહત્વપૂર્ણ સૂચના: ' : 'IMPORTANT NOTICE: '}
              </span>
              <span className="font-semibold underline decoration-yellow-400 decoration-2 underline-offset-2">
                {noticeText}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-100 shrink-0 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5 bg-black/20 px-2.5 py-0.5 rounded-full">
              <Store className="w-3.5 h-3.5 text-yellow-300" />
              <span>{settings.addressGu || 'ખોડાણા દૂધ મંડળી સંકુલ'}</span>
            </span>
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1 bg-white text-red-700 font-bold px-2.5 py-0.5 rounded-full hover:bg-yellow-300 transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>{phoneDisplay}</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
