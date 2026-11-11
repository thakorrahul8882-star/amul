import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Store,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Heart,
} from 'lucide-react';

export const Footer: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t-4 border-red-600 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-md border-2 border-red-700">
                <span className="font-extrabold text-base leading-none font-serif">
                  Amul
                </span>
                <span className="text-[8px] font-bold tracking-widest uppercase text-yellow-300 mt-0.5">
                  PARLOUR
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">
                  {language === 'gu' ? 'અમૂલ પાર્લર ખોડાણા' : 'Amul Parlour Khodana'}
                </h3>
                <p className="text-xs text-red-400 font-semibold">
                  {language === 'gu' ? 'દૂધ મંડળી દ્વારા સંચાલિત' : 'Managed by Milk Cooperative'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t('aboutText')}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>૧૦૦% શુદ્ધ અને ઓથેન્ટિક અમૂલ પ્રોડક્ટ્સ</span>
            </div>
          </div>

          {/* Col 2: Shop Timings */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>{t('shopTimingsTitle')}</span>
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-yellow-300 block mb-0.5">સવારનું સત્ર:</span>
                <span className="text-slate-300">૬:૦૦ AM થી ૧:૦૦ PM (દૂધ ભરવાનો સમય)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-yellow-300 block mb-0.5">સાંજનું સત્ર:</span>
                <span className="text-slate-300">૪:૩૦ PM થી ૯:૩૦ PM</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              *સાત દિવસ ખુલ્લું • ડેરી મંડળી સંકુલ
            </p>
          </div>

          {/* Col 3: Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-500" />
              <span>{t('contactUs')}</span>
            </h4>

            <div className="space-y-2 text-xs">
              <a
                href="https://wa.me/918849526589"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:bg-emerald-900/60 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: 8849526589</span>
              </a>

              <a
                href="tel:8849526589"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white"
              >
                <Phone className="w-4 h-4 text-yellow-400" />
                <span>ફોન: 8849526589</span>
              </a>

              <div className="flex items-start gap-2 text-slate-400 pt-1">
                <Store className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>મુખ્ય બજાર, દૂધ મંડળી સંકુલ, ખોડાણા, ગુજરાત.</span>
              </div>
            </div>
          </div>

          {/* Col 4: Important Shop Pickup Disclaimer */}
          <div className="space-y-3">
            <h4 className="font-bold text-red-400 text-sm uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span>મહત્વપૂર્ણ સૂચના</span>
            </h4>

            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-800/80 text-xs text-red-200 leading-relaxed space-y-2">
              <p className="font-bold text-yellow-300 underline decoration-yellow-400">
                {t('pickupOnlyNotice')}
              </p>
              <p className="text-[11px] text-slate-300">
                {t('disclaimerText')} ગ્રાહકે જાતે ખોડાણા અમૂલ પાર્લર આવીને ઓર્ડર મેળવવાનો રહેશે.
              </p>
            </div>

            <div className="pt-1">
              <button
                onClick={onAdminClick}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 hover:underline transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-red-500" />
                <span>અધિકૃત સંચાલક લોગીન (Admin Portal)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} અમૂલ પાર્લર ખોડાણા. દૂધ ઉત્પાદક સહકારી મંડળી દ્વારા સર્વાધિકાર સુરક્ષિત.
          </div>
          <div className="flex items-center gap-1">
            <span>The Taste of India</span>
            <span>•</span>
            <span className="text-red-400 font-bold">Amul Milk & Dairy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
