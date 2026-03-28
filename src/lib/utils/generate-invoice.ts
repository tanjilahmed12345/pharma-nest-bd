import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

export function generateInvoiceHTML(order: Order): string {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${item.productName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${item.strength}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:right;">${formatPrice(item.discountPrice || item.price)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:right;">${formatPrice((item.discountPrice || item.price) * item.quantity)}</td>
      </tr>`
    )
    .join('');

  const addr = order.shippingAddress;
  const methodLabels: Record<string, string> = { bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', cod: 'Cash on Delivery' };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${order.orderNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;border-bottom:2px solid #004D4F;padding-bottom:20px;">
    <div>
      <h1 style="font-size:24px;color:#004D4F;margin-bottom:4px;">PharmaNest BD</h1>
      <p style="font-size:12px;color:#666;">Your Trusted Online Pharmacy</p>
      <p style="font-size:11px;color:#888;margin-top:8px;">House 42, Road 27, Dhanmondi, Dhaka-1209</p>
      <p style="font-size:11px;color:#888;">Phone: 09638-123456 | Email: care@pharmanestbd.com</p>
      <p style="font-size:11px;color:#888;">DGDA License: DGDA/DL/2024/03782</p>
    </div>
    <div style="text-align:right;">
      <h2 style="font-size:20px;color:#004D4F;margin-bottom:8px;">INVOICE</h2>
      <p style="font-size:13px;"><strong>Order:</strong> ${order.orderNumber}</p>
      <p style="font-size:13px;"><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
      <p style="font-size:13px;"><strong>Payment:</strong> ${methodLabels[order.paymentMethod] || order.paymentMethod}</p>
    </div>
  </div>

  <!-- Billing / Shipping -->
  <div style="margin-bottom:24px;">
    <h3 style="font-size:13px;font-weight:600;color:#004D4F;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">Deliver To</h3>
    <p style="font-size:13px;font-weight:600;">${addr.fullName}</p>
    <p style="font-size:12px;color:#555;">${addr.houseFlat}, ${addr.addressLine}</p>
    <p style="font-size:12px;color:#555;">${addr.area}, ${addr.upazila}, ${addr.district}</p>
    <p style="font-size:12px;color:#555;">${addr.division} - ${addr.postcode}</p>
    <p style="font-size:12px;color:#555;">Phone: ${addr.phone}</p>
  </div>

  <!-- Items table -->
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <thead>
      <tr style="background:#f3f4f6;">
        <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#555;text-transform:uppercase;border-bottom:2px solid #d1d5db;">Product</th>
        <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#555;text-transform:uppercase;border-bottom:2px solid #d1d5db;">Strength</th>
        <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:#555;text-transform:uppercase;border-bottom:2px solid #d1d5db;">Qty</th>
        <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#555;text-transform:uppercase;border-bottom:2px solid #d1d5db;">Unit Price</th>
        <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#555;text-transform:uppercase;border-bottom:2px solid #d1d5db;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <!-- Totals -->
  <div style="display:flex;justify-content:flex-end;margin-bottom:32px;">
    <div style="width:280px;">
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;">
        <span style="color:#666;">Subtotal</span>
        <span>${formatPrice(order.subtotal)}</span>
      </div>
      ${order.discount > 0 ? `
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#e76f51;">
        <span>Discount</span>
        <span>-${formatPrice(order.discount)}</span>
      </div>` : ''}
      ${order.couponCode ? `
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#e76f51;">
        <span>Coupon (${order.couponCode})</span>
        <span>Applied</span>
      </div>` : ''}
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;">
        <span style="color:#666;">Delivery</span>
        <span>${order.deliveryCharge === 0 ? 'Free' : formatPrice(order.deliveryCharge)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:10px 0;font-size:16px;font-weight:700;border-top:2px solid #004D4F;margin-top:6px;">
        <span>Total</span>
        <span style="color:#004D4F;">${formatPrice(order.total)}</span>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="border-top:1px solid #e5e7eb;padding-top:16px;text-align:center;">
    <p style="font-size:11px;color:#999;">Thank you for shopping with PharmaNest BD</p>
    <p style="font-size:10px;color:#bbb;margin-top:4px;">This is a computer-generated invoice and does not require a signature.</p>
  </div>

  <!-- Print button -->
  <div class="no-print" style="text-align:center;margin-top:24px;">
    <button onclick="window.print()" style="padding:10px 24px;background:#004D4F;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
      Download PDF / Print
    </button>
  </div>
</body>
</html>`;
}

export function downloadInvoice(order: Order) {
  const html = generateInvoiceHTML(order);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
