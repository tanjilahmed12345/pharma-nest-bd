export const APP_NAME = 'PharmaNest BD';
export const APP_DESCRIPTION = 'Your Trusted Online Pharmacy in Bangladesh';
export const APP_TAGLINE = 'Genuine Medicines, Delivered to Your Door';

export const CURRENCY = '৳';
export const CURRENCY_CODE = 'BDT';

export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

export const DELIVERY_CHARGE = 60; // BDT
export const FREE_DELIVERY_THRESHOLD = 500; // BDT

export const SEED_VERSION = '2.0.0';

export const MERCHANT_INFO = {
  bkash: {
    merchantNumber: '01963812345',
    merchantName: 'PharmaNest BD',
    instructions: [
      'Open bKash app or dial *247#',
      'Select "Payment"',
      'Enter Merchant Number: 01963812345',
      'Enter the total amount',
      'Enter your bKash PIN',
      'Note the Transaction ID',
      'Enter the Transaction ID below',
    ],
  },
  nagad: {
    merchantNumber: '01863812345',
    merchantName: 'PharmaNest BD',
    instructions: [
      'Open Nagad app or dial *167#',
      'Select "Payment"',
      'Enter Merchant Number: 01863812345',
      'Enter the total amount',
      'Confirm with your PIN',
      'Note the Transaction ID',
      'Enter the Transaction ID below',
    ],
  },
  rocket: {
    merchantNumber: '019638123451',
    merchantName: 'PharmaNest BD',
    instructions: [
      'Dial *322#',
      'Select "Payment"',
      'Enter Merchant Number: 019638123451',
      'Enter the total amount',
      'Enter your Rocket PIN',
      'Note the Transaction ID',
      'Enter the Transaction ID below',
    ],
  },
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  prescription_review_pending: 'Prescription Review Pending',
  approved: 'Approved',
  processing: 'Processing',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  cod_pending: 'COD Pending',
  submitted: 'Submitted',
  verified: 'Verified',
  rejected: 'Rejected',
};

export const PRESCRIPTION_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  needs_clarification: 'Needs Clarification',
};
