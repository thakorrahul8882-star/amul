import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { updateStoreSettings } from '../services/storeService';
import {
  Save,
  Store,
  Phone,
  MessageCircle,
  Clock,
  AlertCircle,
  CheckCircle,
  Key,
} from 'lucide-react';

export const AdminSettings: React.FC<{ settings: StoreSettings }> = ({
  settings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await updateStoreSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('સેટિંગ્સ સેવ કરવામાં ભૂલ આવી.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>સેટિંગ્સ સફળતાપૂર્વક અપડેટ થઈ ગઈ છે! (Settings Saved)</span>
        </div>
      )}

      {/* Basic Store Info */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Store className="w-5 h-5 text-red-600" />
          <h3 className="font-extrabold text-slate-900 text-base">
            દુકાન અને દૂધ મંડળી માહિતી (Store Details)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-700 mb-1">દુકાનનું નામ (ગુજરાતી) *</label>
            <input
              type="text"
              required
              value={formData.storeNameGu}
              onChange={(e) => setFormData({ ...formData, storeNameGu: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Store Name (English) *</label>
            <input
              type="text"
              required
              value={formData.storeNameEn}
              onChange={(e) => setFormData({ ...formData, storeNameEn: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">સબટાઈટલ / સંચાલક (ગુજરાતી) *</label>
            <input
              type="text"
              required
              value={formData.storeSubNameGu}
              onChange={(e) => setFormData({ ...formData, storeSubNameGu: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">WhatsApp ઓર્ડર નોટિફિકેશન નંબર *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm"
              />
              <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              નવા ઓર્ડર આ વોટ્સએપ નંબર પર મોકલવામાં આવશે (દા.ત. 8849526589)
            </p>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
            <input
              type="checkbox"
              checked={formData.isOpen}
              onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span>દુકાન ઓનલાઇન ઓર્ડરિંગ માટે ખુલ્લી છે (Store Open)</span>
          </label>
        </div>
      </div>

      {/* Pickup Notice Configuration */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h3 className="font-extrabold text-slate-900 text-base">
            શોપ પિકઅપ સૂચના (Pickup Only Notice)
          </h3>
        </div>

        <div className="space-y-3 text-xs font-semibold">
          <div>
            <label className="block text-slate-700 mb-1">પિકઅપ સૂચના (ગુજરાતી) *</label>
            <input
              type="text"
              required
              value={formData.pickupNoticeGu}
              onChange={(e) => setFormData({ ...formData, pickupNoticeGu: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Pickup Notice (English) *</label>
            <input
              type="text"
              required
              value={formData.pickupNoticeEn}
              onChange={(e) => setFormData({ ...formData, pickupNoticeEn: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Timings & Address */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="font-extrabold text-slate-900 text-base">
            સમય અને સરનામું (Timings & Location)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-700 mb-1">સવારનો સમય (Morning Timing)</label>
            <input
              type="text"
              value={formData.morningTiming}
              onChange={(e) => setFormData({ ...formData, morningTiming: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">સાંજનો સમય (Evening Timing)</label>
            <input
              type="text"
              value={formData.eveningTiming}
              onChange={(e) => setFormData({ ...formData, eveningTiming: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 mb-1">સરનામું (Address)</label>
            <input
              type="text"
              value={formData.addressGu}
              onChange={(e) => setFormData({ ...formData, addressGu: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp Cloud API Details (Backend Proxy) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Key className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-slate-900 text-base">
            WhatsApp Business Cloud API (વૈકલ્પિક ઓટોમેશન)
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          Meta WhatsApp Cloud API ની મદદથી ગ્રાહક ઓર્ડર કરે ત્યારે આપમેળે તમારા ફોન પર મેસેજ આવી જશે.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-700 mb-1">Phone Number ID</label>
            <input
              type="text"
              value={formData.whatsappPhoneNumberId || ''}
              onChange={(e) => setFormData({ ...formData, whatsappPhoneNumberId: e.target.value })}
              placeholder="e.g. 104859672849503"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">System User Access Token</label>
            <input
              type="password"
              value={formData.whatsappApiToken || ''}
              onChange={(e) => setFormData({ ...formData, whatsappApiToken: e.target.value })}
              placeholder="EAAG..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
            />
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-lg transition-transform active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'સેવ થાય છે...' : 'સેટિંગ્સ સાચવો (Save Settings)'}</span>
        </button>
      </div>

    </form>
  );
};
