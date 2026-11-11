import React, { useState, useRef } from 'react';
import { Product, Category } from '../types';
import { saveProduct, deleteProduct } from '../services/storeService';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  Check,
  X,
  AlertCircle,
  Star,
  Sparkles,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Camera,
  Link as LinkIcon,
  XCircle,
} from 'lucide-react';

interface Props {
  products: Product[];
  categories: Category[];
}

/**
 * Resizes and compresses an image file on the client using HTML5 Canvas
 */
function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 640;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Fill background white for PNG transparency
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export const AdminProductManagement: React.FC<Props> = ({
  products,
  categories,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [nameGu, setNameGu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [descriptionGu, setDescriptionGu] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [availableStock, setAvailableStock] = useState<number>(10);
  const [unit, setUnit] = useState('500ml');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Photo Upload States
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('કૃપા કરીને માત્ર ફોટો ફાઇલ પસંદ કરો (JPG, PNG, WebP).');
      return;
    }
    setIsCompressing(true);
    try {
      const compressedDataUrl = await compressImageFile(file);
      setImageUrl(compressedDataUrl);
    } catch (err) {
      console.error('Image compression error:', err);
      alert('ફોટો પ્રોસેસ કરવામાં ભૂલ આવી.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setNameGu('');
    setNameEn('');
    setCategoryId(categories[0]?.id || 'cat-milk');
    setDescriptionGu('');
    setDescriptionEn('');
    setSellingPrice(30);
    setOriginalPrice(32);
    setAvailableStock(25);
    setUnit('500ml Pouch');
    setImageUrl('https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80');
    setImageInputMode('upload');
    setIsAvailable(true);
    setIsFeatured(false);
    setIsNew(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setNameGu(p.nameGu);
    setNameEn(p.nameEn);
    setCategoryId(p.categoryId);
    setDescriptionGu(p.descriptionGu || '');
    setDescriptionEn(p.descriptionEn || '');
    setSellingPrice(p.sellingPrice);
    setOriginalPrice(p.originalPrice);
    setAvailableStock(p.availableStock);
    setUnit(p.unit);
    setImageUrl(p.imageUrl);
    setImageInputMode(p.imageUrl?.startsWith('data:') ? 'upload' : 'upload');
    setIsAvailable(p.isAvailable);
    setIsFeatured(p.isFeatured);
    setIsNew(!!p.isNew);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameGu.trim() || !nameEn.trim()) return;

    setLoading(true);
    try {
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const categoryName = selectedCategory?.nameEn || 'Amul Dairy';

      const prodData: Product = {
        id: editingProduct ? editingProduct.id : `prod_${Date.now()}`,
        nameGu: nameGu.trim(),
        nameEn: nameEn.trim(),
        categoryId,
        categoryName,
        descriptionGu: descriptionGu.trim(),
        descriptionEn: descriptionEn.trim(),
        sellingPrice: Number(sellingPrice),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        availableStock: Number(availableStock),
        unit: unit.trim() || 'Unit',
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
        isAvailable,
        isFeatured,
        isNew,
      };

      await saveProduct(prodData);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('પ્રોડક્ટ સેવ કરવામાં ભૂલ આવી.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`શું તમે "${name}" પ્રોડક્ટ કાઢી નાખવા માંગો છો?`)) return;
    try {
      await deleteProduct(id);
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('પ્રોડક્ટ ડિલીટ કરવામાં ભૂલ આવી.');
    }
  };

  const toggleAvailability = async (p: Product) => {
    try {
      await saveProduct({ ...p, isAvailable: !p.isAvailable });
    } catch (err) {
      console.error('Toggle error', err);
    }
  };

  const quickUpdateStock = async (p: Product, delta: number) => {
    const newStock = Math.max(0, p.availableStock + delta);
    try {
      await saveProduct({ ...p, availableStock: newStock });
    } catch (err) {
      console.error('Stock update error', err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCat === 'all' || p.categoryId === selectedCat;
    const matchSearch =
      search.trim() === '' ||
      p.nameGu.toLowerCase().includes(search.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Search & Add Product */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="પ્રોડક્ટ શોધો..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">બધી કેટેગરી ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameGu}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>નવી પ્રોડક્ટ ઉમેરો</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">પ્રોડક્ટ</th>
                <th className="py-3 px-4">કેટેગરી</th>
                <th className="py-3 px-4">ભાવ (₹)</th>
                <th className="py-3 px-4">સ્ટોક</th>
                <th className="py-3 px-4">સ્થિતિ</th>
                <th className="py-3 px-4">ફીચર્ડ</th>
                <th className="py-3 px-4 text-right">ક્રિયા</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    કોઈ પ્રોડક્ટ મળી નથી.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Image & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.nameEn}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {p.nameGu}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {p.nameEn} • <span className="font-semibold text-slate-700">{p.unit}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-600">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-semibold text-slate-700 text-[11px]">
                        {p.categoryName || 'Dairy'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 text-sm">
                        ₹{p.sellingPrice}
                      </div>
                      {p.originalPrice && p.originalPrice > p.sellingPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          MRP: ₹{p.originalPrice}
                        </div>
                      )}
                    </td>

                    {/* Stock Counter with quick +/- */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => quickUpdateStock(p, -1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                          title="-1"
                        >
                          -
                        </button>
                        <span className={`w-8 text-center font-bold ${p.availableStock <= 5 ? 'text-red-600' : 'text-slate-800'}`}>
                          {p.availableStock}
                        </span>
                        <button
                          onClick={() => quickUpdateStock(p, 1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                          title="+1"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* In Stock toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleAvailability(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-colors ${
                          p.isAvailable && p.availableStock > 0
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {p.isAvailable && p.availableStock > 0 ? '✓ In Stock' : '✕ Out of Stock'}
                      </button>
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {p.isFeatured && (
                          <span className="p-1 rounded bg-amber-100 text-amber-700" title="Featured">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          </span>
                        )}
                        {p.isNew && (
                          <span className="p-1 rounded bg-blue-100 text-blue-700" title="New">
                            <Sparkles className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.nameGu)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            onClick={() => !loading && setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              
              <div className="p-5 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between">
                <h3 className="font-extrabold text-base sm:text-lg">
                  {editingProduct ? 'પ્રોડક્ટ એડિટ કરો' : 'નવી અમૂલ પ્રોડક્ટ ઉમેરો'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 text-xs font-semibold">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">પ્રોડક્ટનું નામ (ગુજરાતી) *</label>
                    <input
                      type="text"
                      required
                      value={nameGu}
                      onChange={(e) => setNameGu(e.target.value)}
                      placeholder="દા.ત. અમૂલ ગોલ્ડ દૂધ (૫૦૦ મિલી)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">Product Name (English) *</label>
                    <input
                      type="text"
                      required
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="e.g. Amul Gold Milk (500ml)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">કેટેગરી *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nameGu}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">વેચાણ ભાવ (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">MRP / મૂળ ભાવ (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={originalPrice || ''}
                      onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="વૈકલ્પિક"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">પેકિંગ યુનિટ (દા.ત. 500ml / 1kg) *</label>
                    <input
                      type="text"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="500ml Pouch"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">ઉપલબ્ધ સ્ટોક (જથ્થો) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={availableStock}
                      onChange={(e) => setAvailableStock(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Product Image Section: Direct Upload & URL Toggle */}
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-1">
                    <label className="text-slate-800 font-bold flex items-center gap-1.5 text-xs">
                      <Camera className="w-4 h-4 text-red-600" />
                      <span>પ્રોડક્ટ ફોટો (Product Photo) *</span>
                    </label>

                    {/* Mode Toggle */}
                    <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setImageInputMode('upload')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                          imageInputMode === 'upload'
                            ? 'bg-white text-red-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        <span>ડાયરેક્ટ અપલોડ (Upload)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                          imageInputMode === 'url'
                            ? 'bg-white text-red-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>ઇમેજ લિંક (URL)</span>
                      </button>
                    </div>
                  </div>

                  {/* Direct File Upload Tab */}
                  {imageInputMode === 'upload' && (
                    <div className="space-y-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {/* If Image is present (Preview Card) */}
                      {imageUrl ? (
                        <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-300 shrink-0">
                            <img
                              src={imageUrl}
                              alt="Product Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow">
                              <Check className="w-3 h-3" />
                            </div>
                          </div>

                          <div className="flex-1 text-center sm:text-left space-y-1.5">
                            <div className="flex items-center justify-center sm:justify-start gap-1 text-emerald-700 font-bold text-xs">
                              <Check className="w-3.5 h-3.5" />
                              <span>ફોટો પસંદ થઈ ગયો છે! (Photo Selected)</span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              ફોટો આપમેળે ઓપ્ટિમાઈઝ અને કમ્પ્રેસ થઈ ગયો છે.
                            </p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-300"
                              >
                                <Camera className="w-3.5 h-3.5 text-blue-600" />
                                <span>બીજો ફોટો બદલો (Change)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setImageUrl('')}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors border border-red-200"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                <span>હટાવો (Remove)</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Empty Dropzone for direct upload */
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={handleDrop}
                          className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                            isDragging
                              ? 'border-red-500 bg-red-50/50 scale-[1.01]'
                              : 'border-slate-300 hover:border-red-500 bg-white hover:bg-red-50/30'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-2 shadow-inner">
                            {isCompressing ? (
                              <span className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <Upload className="w-6 h-6" />
                            )}
                          </div>

                          <div className="font-bold text-slate-800 text-xs sm:text-sm">
                            {isCompressing
                              ? 'ફોટો પ્રોસેસ થઈ રહ્યો છે...'
                              : 'અહીં ક્લિક કરી તમારા મોબાઈલ / કમ્પ્યુટરમાંથી ફોટો અપલોડ કરો'}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            કેમેરા, ગેલરી અથવા ફાઇલ પસંદ કરો (JPG, PNG, WebP) • આપમેળે સાઈઝ ઓપ્ટિમાઈઝ થશે
                          </p>

                          <button
                            type="button"
                            className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors"
                          >
                            <Camera className="w-3.5 h-3.5 text-yellow-300" />
                            <span>ફોટો પસંદ કરો (Choose Photo)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Image URL Tab */}
                  {imageInputMode === 'url' && (
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                      {imageUrl && (
                        <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                          <img
                            src={imageUrl}
                            alt="URL Preview"
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                          <div className="text-[11px] text-slate-600 truncate flex-1 font-mono">
                            {imageUrl}
                          </div>
                          <button
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="text-xs text-red-600 hover:underline px-2"
                          >
                            હટાવો
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">વર્ણન (ગુજરાતી)</label>
                    <textarea
                      rows={2}
                      value={descriptionGu}
                      onChange={(e) => setDescriptionGu(e.target.value)}
                      placeholder="તાજું દૂધ, ૬.૦% ફેટ..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Description (English)</label>
                    <textarea
                      rows={2}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      placeholder="Fresh pasteurized milk..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>વેચાણ માટે ઉપલબ્ધ (In Stock)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>હોમપેજ પર ફીચર્ડ (Popular)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>નવું ઉત્પાદન (New Badge)</span>
                  </label>
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
                    {loading ? 'સેવ થઈ રહ્યું છે...' : 'સાચવો (Save Product)'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
