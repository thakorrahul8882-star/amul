import { Order } from '../types';
import { getStoredSettings } from './storeService';

export const SHOP_WHATSAPP_NUMBER = '8849526589';

/**
 * Format the exact WhatsApp notification text required by the prompt
 */
export function formatOrderWhatsAppMessage(order: Order): string {
  const currentSettings = getStoredSettings();
  const productLines = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.nameEn || item.nameGu} × ${item.quantity} – ₹${item.subtotal}`
    )
    .join('\n');

  return `*NEW AMUL PARLOUR ORDER*

Order ID: ${order.orderId}

Customer Name: ${order.customerName}
Mobile: ${order.customerMobile}

Products:
${productLines}

Total: ₹${order.totalAmount}

Payment: ${order.paymentMethod === 'counter_cash' ? 'Cash at Counter' : 'UPI at Counter'}
${order.orderNotes ? `Notes: ${order.orderNotes}\n` : ''}Pickup: ${currentSettings.storeNameEn || currentSettings.storeNameGu}
${currentSettings.storeSubNameGu}
(${currentSettings.pickupNoticeGu || 'Only Shop Pickup - No Home Delivery'})`;
}

/**
 * Send WhatsApp notification via backend API proxy
 */
export async function sendAutomaticWhatsAppNotification(order: Order): Promise<{
  success: boolean;
  message: string;
  channel?: 'cloud_api' | 'fallback_ready';
}> {
  try {
    const currentSettings = getStoredSettings();
    const recipient = currentSettings.whatsappNumber || SHOP_WHATSAPP_NUMBER;

    const response = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientPhone: recipient,
        order: order,
        message: formatOrderWhatsAppMessage(order),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: data.message || 'WhatsApp notification processed successfully',
        channel: data.channel || 'cloud_api',
      };
    } else {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errData.message || 'WhatsApp API not configured or failed; fallback available',
        channel: 'fallback_ready',
      };
    }
  } catch (error) {
    console.warn('Backend WhatsApp API trigger:', error);
    return {
      success: false,
      message: 'Network error communicating with WhatsApp service',
      channel: 'fallback_ready',
    };
  }
}

/**
 * Generate direct WhatsApp web/app link for fallback or customer confirmation
 */
export function getWhatsAppClickToChatLink(order: Order, phone?: string): string {
  const currentSettings = getStoredSettings();
  const targetNumber = phone || currentSettings.whatsappNumber || SHOP_WHATSAPP_NUMBER;
  const cleanPhone = targetNumber.replace(/\D/g, '');
  const internationalPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const message = encodeURIComponent(formatOrderWhatsAppMessage(order));
  return `https://wa.me/${internationalPhone}?text=${message}`;
}

/**
 * Generate customer status update message for shopkeeper to send to customer
 */
export function getCustomerStatusUpdateWhatsAppLink(order: Order): string {
  const currentSettings = getStoredSettings();
  const cleanMobile = order.customerMobile.replace(/\D/g, '');
  const targetPhone = cleanMobile.startsWith('91') ? cleanMobile : `91${cleanMobile}`;
  const storeName = currentSettings.storeNameGu || 'અમૂલ પાર્લર ખોડાણા';
  const contactNo = currentSettings.whatsappNumber || currentSettings.phone || SHOP_WHATSAPP_NUMBER;

  const statusTextGu =
    order.status === 'ready_for_pickup'
      ? `તમારો ઓર્ડર દુકાનેથી મેળવવા માટે તૈયાર છે! કૃપા કરીને ${storeName} (${currentSettings.storeSubNameGu}) થી પિકઅપ કરી લો.`
      : order.status === 'accepted'
      ? 'તમારો ઓર્ડર સ્વીકારાઈ ગયો છે અને પેક કરવામાં આવી રહ્યો છે.'
      : order.status === 'completed'
      ? `ઓર્ડર મેળવવા બદલ આપનો ખૂબ ખૂબ આભાર! - ${storeName}`
      : `તમારા ઓર્ડરનું વર્તમાન સ્ટેટસ: ${order.status}`;

  const message = `નમસ્તે ${order.customerName},\n\n*${storeName} (${currentSettings.storeSubNameGu})*\nઓર્ડર નંબર: ${order.orderId}\nકુલ રકમ: ₹${order.totalAmount}\n\n${statusTextGu}\n\nપિકઅપ સરનામું: ${currentSettings.addressGu}\nસંપર્ક: ${contactNo}`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}
