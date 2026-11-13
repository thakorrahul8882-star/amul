import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/error';
import { Category, Product, Order, StoreSettings, OrderStatus, OrderItem } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, DEFAULT_STORE_SETTINGS } from '../data/defaultCatalog';

const CATEGORIES_COLLECTION = 'categories';
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const SETTINGS_COLLECTION = 'storeSettings';
const SETTINGS_DOC_ID = 'config';

export const ADMIN_PASSCODE = 'Amul@8849';

/**
 * Initializes database with default Amul products, categories, and settings if empty
 */
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsDocRef);

    if (!settingsSnap.exists()) {
      console.log('Bootstrapping initial Amul parlour catalog...');

      // Seed categories first
      for (const cat of DEFAULT_CATEGORIES) {
        try {
          await setDoc(doc(db, CATEGORIES_COLLECTION, cat.id), {
            ...cat,
            createdAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Category seed notice:', cat.id, e);
        }
      }

      // Seed products
      for (const prod of DEFAULT_PRODUCTS) {
        try {
          await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), {
            ...prod,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Product seed notice:', prod.id, e);
        }
      }

      // Finalize store settings to close uninitialized window
      await setDoc(settingsDocRef, {
        ...DEFAULT_STORE_SETTINGS,
        updatedAt: new Date().toISOString(),
      });
      console.log('Database successfully seeded with Amul inventory!');
    }
  } catch (error) {
    // Non-fatal, application seamlessly falls back to DEFAULT_PRODUCTS / DEFAULT_CATEGORIES
    console.warn('Initial data check notice:', error);
  }
}

/**
 * Subscribe to all products
 */
export function subscribeToProducts(
  callback: (products: Product[]) => void,
  onError?: (err: unknown) => void
) {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const products: Product[] = [];
        snapshot.forEach((d) => {
          products.push({ id: d.id, ...d.data() } as Product);
        });
        if (products.length === 0) {
          callback(DEFAULT_PRODUCTS);
        } else {
          callback(products);
        }
      },
      (error) => {
        console.warn('Firestore products subscription notice, using default catalog:', error);
        callback(DEFAULT_PRODUCTS);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.warn('Failed to listen to products, using default catalog:', error);
    callback(DEFAULT_PRODUCTS);
    return () => {};
  }
}

/**
 * Subscribe to all categories
 */
export function subscribeToCategories(
  callback: (categories: Category[]) => void,
  onError?: (err: unknown) => void
) {
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const categories: Category[] = [];
        snapshot.forEach((d) => {
          categories.push({ id: d.id, ...d.data() } as Category);
        });
        if (categories.length === 0) {
          callback(DEFAULT_CATEGORIES);
        } else {
          categories.sort((a, b) => a.order - b.order);
          callback(categories);
        }
      },
      (error) => {
        console.warn('Firestore categories subscription notice, using default categories:', error);
        callback(DEFAULT_CATEGORIES);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.warn('Failed to listen to categories, using default categories:', error);
    callback(DEFAULT_CATEGORIES);
    return () => {};
  }
}

/**
 * Get locally cached store settings synchronously
 */
export function getStoredSettings(): StoreSettings {
  try {
    const cached = localStorage.getItem('amul_store_settings');
    if (cached) {
      return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(cached) };
    }
  } catch {
    // Ignore
  }
  return DEFAULT_STORE_SETTINGS;
}

/**
 * Subscribe to store settings
 */
export function subscribeToStoreSettings(
  callback: (settings: StoreSettings) => void
) {
  // First invoke callback immediately with cached settings if available
  try {
    const cached = localStorage.getItem('amul_store_settings');
    if (cached) {
      callback({ ...DEFAULT_STORE_SETTINGS, ...JSON.parse(cached) });
    }
  } catch {
    // Ignore
  }

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as StoreSettings;
          const merged = { ...DEFAULT_STORE_SETTINGS, ...remoteData };
          try {
            localStorage.setItem('amul_store_settings', JSON.stringify(merged));
          } catch {
            // Ignore
          }
          callback(merged);
        } else {
          callback(getStoredSettings());
        }
      },
      (error) => {
        console.warn('Firestore settings subscription notice, using cached/default settings:', error);
        callback(getStoredSettings());
      }
    );
  } catch (error) {
    callback(getStoredSettings());
    return () => {};
  }
}

/**
 * Create Order with server-side validation against database prices & stock
 */
export async function createOrder(orderData: {
  customerName: string;
  customerMobile: string;
  items: { productId: string; quantity: number }[];
  paymentMethod: 'counter_cash' | 'counter_upi';
  orderNotes?: string;
}): Promise<Order> {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const formattedOrderId = `#AMUL${randomSuffix}`;
  const orderDocId = `order_${timestamp}_${randomSuffix}`;

  try {
    const calculatedOrder = await runTransaction(db, async (transaction) => {
      let verifiedTotal = 0;
      const verifiedItems: OrderItem[] = [];

      for (const item of orderData.items) {
        if (item.quantity <= 0) {
          throw new Error('Quantity must be greater than zero');
        }

        const prodRef = doc(db, PRODUCTS_COLLECTION, item.productId);
        const prodDoc = await transaction.get(prodRef);

        let prodData: Product;
        if (!prodDoc.exists()) {
          const defaultProd = DEFAULT_PRODUCTS.find((p) => p.id === item.productId);
          if (!defaultProd) {
            throw new Error(`Product ${item.productId} not found`);
          }
          prodData = defaultProd;
          transaction.set(prodRef, {
            ...prodData,
            availableStock: Math.max(0, prodData.availableStock - item.quantity),
            updatedAt: new Date().toISOString(),
          });
        } else {
          prodData = prodDoc.data() as Product;
          if (!prodData.isAvailable) {
            throw new Error(`Product "${prodData.nameGu}" is currently unavailable`);
          }
          if (prodData.availableStock < item.quantity) {
            throw new Error(
              `Insufficient stock for "${prodData.nameGu}". Only ${prodData.availableStock} available.`
            );
          }
          transaction.update(prodRef, {
            availableStock: prodData.availableStock - item.quantity,
            updatedAt: new Date().toISOString(),
          });
        }

        const price = Number(prodData.sellingPrice);
        const subtotal = price * item.quantity;
        verifiedTotal += subtotal;

        verifiedItems.push({
          productId: prodData.id,
          nameGu: prodData.nameGu,
          nameEn: prodData.nameEn,
          unit: prodData.unit,
          price: price,
          quantity: item.quantity,
          subtotal: subtotal,
        });
      }

      const finalOrder: Order = {
        orderId: formattedOrderId,
        customerName: orderData.customerName.trim(),
        customerMobile: orderData.customerMobile.trim(),
        items: verifiedItems,
        totalAmount: verifiedTotal,
        status: 'new',
        paymentMethod: orderData.paymentMethod,
        orderNotes: orderData.orderNotes?.trim() || '',
        pickupLocation: 'અમૂલ પાર્લર ખોડાણા (દૂધ મંડળી સંકુલ)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        whatsappNotificationStatus: 'sent',
      };

      const orderRef = doc(db, ORDERS_COLLECTION, orderDocId);
      transaction.set(orderRef, finalOrder);

      return { ...finalOrder, id: orderDocId };
    });

    return calculatedOrder;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, ORDERS_COLLECTION);
  }
}

/**
 * Track order by Order ID and Mobile number
 */
export async function findOrderByTracking(
  orderIdInput: string,
  mobileInput: string
): Promise<Order | null> {
  try {
    const cleanOrderId = orderIdInput.trim().toUpperCase().replace(/^#/, '');
    const cleanMobile = mobileInput.trim().replace(/\D/g, '');

    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    let matchedOrder: Order | null = null;

    snapshot.forEach((d) => {
      const data = d.data() as Order;
      const targetId = (data.orderId || '').toUpperCase().replace(/^#/, '');
      const targetMobile = (data.customerMobile || '').replace(/\D/g, '');

      if (
        (targetId === cleanOrderId || d.id === cleanOrderId) &&
        (targetMobile === cleanMobile || targetMobile.endsWith(cleanMobile.slice(-10)))
      ) {
        matchedOrder = { ...data, id: d.id };
      }
    });

    return matchedOrder;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, ORDERS_COLLECTION);
  }
}

/**
 * Subscribe to all orders for Admin
 */
export function subscribeToOrders(
  callback: (orders: Order[]) => void,
  onError?: (err: unknown) => void
) {
  try {
    const q = query(collection(db, ORDERS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((d) => {
          orders.push({ id: d.id, ...d.data() } as Order);
        });
        // Sort newest first
        orders.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        callback(orders);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderDocId: string,
  newStatus: OrderStatus
): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderDocId);
    await updateDoc(orderRef, {
      status: newStatus,
      adminPasscode: ADMIN_PASSCODE,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderDocId}`);
  }
}

/**
 * Admin: Add / Update Product
 */
export async function saveProduct(product: Product): Promise<void> {
  try {
    const prodRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(
      prodRef,
      {
        ...product,
        adminPasscode: ADMIN_PASSCODE,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${product.id}`);
  }
}

/**
 * Admin: Delete Product
 */
export async function deleteProduct(productId: string): Promise<void> {
  try {
    const prodRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(prodRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${productId}`);
  }
}

/**
 * Admin: Clear All Products from Firestore
 */
export async function clearAllProductsFromFirestore(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
    console.log('All products successfully cleared from Firestore.');
  } catch (error) {
    console.warn('Notice while clearing products from Firestore:', error);
  }
}

/**
 * Admin: Add / Update Category
 */
export async function saveCategory(category: Category): Promise<void> {
  try {
    const catRef = doc(db, CATEGORIES_COLLECTION, category.id);
    await setDoc(
      catRef,
      {
        ...category,
        adminPasscode: ADMIN_PASSCODE,
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${CATEGORIES_COLLECTION}/${category.id}`);
  }
}

/**
 * Admin: Delete Category
 */
export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    const catRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await deleteDoc(catRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CATEGORIES_COLLECTION}/${categoryId}`);
  }
}

/**
 * Admin: Update Store Settings
 */
export async function updateStoreSettings(settings: StoreSettings): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);

    // Sanitize to eliminate any undefined values which cause Firestore setDoc() to fail
    const cleanPayload: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(settings)) {
      if (val !== undefined) {
        cleanPayload[key] = val;
      }
    }

    const payload = {
      ...cleanPayload,
      adminPasscode: ADMIN_PASSCODE,
      updatedAt: new Date().toISOString(),
    };

    // Update Firestore
    await setDoc(docRef, payload, { merge: true });

    // Cache locally so updates take effect immediately without refresh
    try {
      localStorage.setItem('amul_store_settings', JSON.stringify({ ...DEFAULT_STORE_SETTINGS, ...cleanPayload }));
      window.dispatchEvent(new Event('amul_settings_updated'));
    } catch {
      // Ignore
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_COLLECTION}/${SETTINGS_DOC_ID}`);
  }
}
