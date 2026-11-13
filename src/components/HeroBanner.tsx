import React from 'react';
import {
  ShoppingBag,
  Clock,
  Store,
  MessageCircle,
  Award,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const HeroBanner: React.FC<{ onExploreClick: () => void }> = ({
  onExploreClick,
}) => {
  const { language, t } = useLanguage();
  const settings = useStoreSettings();

  const phoneDisplay = settings.whatsappNumber || settings.phone || '8849526589';
  const cleanPhone = phoneDisplay.replace(/\D/g, '');
  const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const pickupLine = language === 'gu' ? settings.pickupNoticeGu : settings.pickupNoticeEn;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-rose-700 text-white rounded-3xl shadow-xl my-4 sm:my-6 border border-red-800">
      {/* Decorative Amul polka dots / milk wave patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px] pointer-events-none"></div>
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-red-500 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-8 sm:py-12 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs sm:text-sm font-bold border border-white/20">
            <Award className="w-4 h-4 text-yellow-300" />
            <span className="text-yellow-200">
              {language === 'gu' ? settings.storeSubNameGu : settings.storeSubNameEn}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {language === 'gu' ? (
              <>
                {settings.storeNameGu} <br />
                <span className="text-yellow-300 underline decoration-yellow-400 decoration-wavy decoration-2">
                  અમૂલ ડેરી ઉત્પાદનો
                </span>
              </>
            ) : (
              <>
                {settings.storeNameEn} <br />
                <span className="text-yellow-300 underline decoration-yellow-400 decoration-wavy decoration-2">
                  Amul Dairy Products
                </span>
              </>
            )}
          </h1>

          <p className="text-slate-100 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
            {language === 'gu'
              ? `અમૂલ ગોલ્ડ દૂધ, ઘી, માખણ, તાજું પનીર, ચીઝ, કેસર શ્રીખંડ અને લોકપ્રિય આઈસ્ક્રીમ હવે ઓનલાઇન પસંદ કરો અને ${settings.addressGu} પરથી મેળવી લો.`
              : `Choose fresh Amul Gold milk, pure ghee, butter, paneer, cheese, shrikhand and ice creams online and pick up directly from ${settings.storeNameEn}.`}
          </p>

          {/* Timing & Pickup highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 text-slate-900 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left text-xs">
                <div className="font-bold text-yellow-300">દૂધ મંડળી સમય</div>
                <div className="text-slate-200 font-semibold">
                  {settings.morningTiming} | {settings.eveningTiming}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div className="text-left text-xs">
                <div className="font-bold text-blue-200">૧૦૦% શોપ પિકઅપ</div>
                <div className="text-slate-200 font-semibold">{pickupLine}</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold px-6 py-3 rounded-2xl shadow-lg transition-transform transform active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{t('browseProducts')}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`નમસ્તે, ${settings.storeNameGu} ડેરી પ્રોડક્ટ્સ બાબતે માહિતી જોઈએ છે.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-2xl shadow-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp: {phoneDisplay}</span>
            </a>
          </div>

        </div>

        {/* Right Feature Card */}
        <div className="w-full lg:w-96 bg-white rounded-3xl p-5 text-slate-800 shadow-2xl border-4 border-yellow-400/40 shrink-0">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
            <div className="flex items-center gap-2">
              {settings.isOpen ? (
                <>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    {language === 'gu' ? 'પાર્લર ચાલુ છે' : 'Parlour Open'}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                    {language === 'gu' ? 'પાર્લર હાલ બંધ છે' : 'Parlour Closed'}
                  </span>
                </>
              )}
            </div>
            <span className="text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full truncate max-w-[160px]" title={settings.addressGu}>
              {settings.village || 'ખોડાણા ગામ'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-2xl">🥛</span>
              <div>
                <h2 className="text-xs font-bold text-slate-900">અમૂલ ગોલ્ડ & તાઝા દૂધ</h2>
                <p className="text-[11px] text-slate-500">દરરોજ તાજી ડિલિવરી, ફુલ ક્રીમ & ટોન્ડ</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-2xl">🧈</span>
              <div>
                <h2 className="text-xs font-bold text-slate-900">શુદ્ધ ઘી & માખણ</h2>
                <p className="text-[11px] text-slate-500">૧ લીટર સેકા પેક, ગાયનું ઘી અને બટર</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-2xl">🍦</span>
              <div>
                <h2 className="text-xs font-bold text-slate-900">આઈસ્ક્રીમ & શ્રીખંડ</h2>
                <p className="text-[11px] text-slate-500">કેસર પિસ્તા, વેનીલા, કેરી & ચોકલેટ્સ</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-red-600 font-bold">
              🚫 {pickupLine}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
