/**
 * WhatsApp utility functions for BRANA KIDS
 */

/**
 * Get the WhatsApp phone number from environment variables
 * @returns The WhatsApp phone number with fallback
 */
export function getWhatsAppPhone(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "+254758212888";
}

/**
 * Get the WhatsApp phone number without formatting (digits only)
 * @returns The WhatsApp phone number as digits only
 */
export function getWhatsAppPhoneDigits(): string {
  return getWhatsAppPhone().replace(/[^0-9]/g, '');
}

/**
 * Generate a WhatsApp URL for a given message
 * @param message - The message to send
 * @returns The complete WhatsApp URL
 */
export function getWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  const phoneDigits = getWhatsAppPhoneDigits();
  return `https://wa.me/${phoneDigits}?text=${encodedMessage}`;
}

/**
 * Generate a WhatsApp order message
 * @param items - Array of cart items
 * @param total - Total amount
 * @param customerName - Customer name (optional)
 * @param customerPhone - Customer phone (optional)
 * @returns Formatted WhatsApp message
 */
export function generateOrderMessage(
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  customerName?: string,
  customerPhone?: string
): string {
  const orderDetails = items.map(item =>
    `• ${item.name} x${item.quantity} - KES ${(item.price * item.quantity).toLocaleString()}`
  ).join('\n');

  let message = `*New Order from BRANA KIDS* 🛒\n\n`;
  
  if (customerName) {
    message += `*Customer:* ${customerName}\n`;
  }
  if (customerPhone) {
    message += `*Phone:* ${customerPhone}\n`;
  }
  
  message += `\n*Order Items:*\n${orderDetails}\n\n`;
  message += `*Total Amount:* KES ${total.toLocaleString()}\n\n`;
  message += `Thank you for choosing BRANA KIDS! 🌟`;

  return message;
}

