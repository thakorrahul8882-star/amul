import React, { useState } from 'react';
import { Category } from '../types';
import { saveCategory, deleteCategory } from '../services/storeService';
import { Plus, Edit2, Trash2, Layers, Check, X } from 'lucide-react';

export const AdminCategoryManagement: React.FC<{ categories: Category[] }> = ({
  categories,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [nameGu, setNameGu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAdd = () => {
    setEditingCategory(null);
    setNameGu('');
    setNameEn('');
    setSlug('');
    setOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setNameGu(cat.nameGu);
    setNameEn(cat.nameEn);
    setSlug(cat.slug);
    setOrder(cat.order);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameGu.trim() || !nameEn.trim()) return;

    setLoading(true);
    try {
      const catId = editingCategory ? editingCategory.id : `cat_${Date.now()}`;
      const generatedSlug = slug.trim() || nameEn.toLowerCase().replace(/\s+/g, '-');

      await saveCategory({
        id: catId,
        nameGu: nameGu.trim(),
        nameEn: nameEn.trim(),
        slug: generatedSlug,
        order: Number(order),
        isActive: true,
      });

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!catToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCategory(catToDelete.id);
      setCatToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
            પ્રોડક્ટ કેટેગરીઝ વ્યવસ્થાપન
          </h3>
          <p className="text-xs text-slate-500">
            કુલ {categories.length} કેટેગરી ઉપલબ્ધ છે.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>નવી કેટેગરી ઉમેરો</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  ક્રમ: {cat.order}
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {cat.nameGu}
                </h4>
                <p className="text-xs text-slate-500 font-medium">{cat.nameEn}</p>
              </div>
              <span className="p-2 rounded-xl bg-red-50 text-red-600">
                <Layers className="w-5 h-5" />
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-mono">
                slug: {cat.slug}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCatToDelete(cat)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            onClick={() => !loading && setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="p-5 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between">
                <h3 className="font-extrabold text-base">
                  {editingCategory ? 'કેટેગરી એડિટ કરો' : 'નવી કેટેગરી ઉમેરો'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-5 space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1">કેટેગરી નામ (ગુજરાતી) *</label>
                  <input
                    type="text"
                    required
                    value={nameGu}
                    onChange={(e) => setNameGu(e.target.value)}
                    placeholder="દા.ત. શુદ્ધ ઘી"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Category Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Pure Ghee"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Slug (URL કી)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. ghee"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">ક્રમ (Order)</label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700"
                  >
                    રદ કરો
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                  >
                    {loading ? 'સેવ થાય છે...' : 'સાચવો (Save)'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* In-App Delete Category Confirmation Modal (Iframe Safe) */}
      {catToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => !isDeleting && setCatToDelete(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 p-5 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                કેટેગરી કાઢી નાખો
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                શું તમે ખરેખર "{catToDelete.nameGu}" કેટેગરી કાઢી નાખવા માંગો છો?
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCatToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50"
              >
                રદ કરો
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-xs text-white shadow-sm flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>કાઢી નાખો</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
