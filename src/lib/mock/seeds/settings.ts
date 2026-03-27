export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  bkashMerchant: string;
  nagadMerchant: string;
  rocketMerchant: string;
  currency: string;
  currencySymbol: string;
}

export const seedSettings: StoreSettings = {
  storeName: 'PharmaNest BD',
  storeEmail: 'support@pharmanest.com.bd',
  storePhone: '01700000000',
  storeAddress: 'House 12, Road 5, Dhanmondi, Dhaka-1205',
  deliveryCharge: 60,
  freeDeliveryThreshold: 500,
  bkashMerchant: '01XXXXXXXXX',
  nagadMerchant: '01XXXXXXXXX',
  rocketMerchant: '01XXXXXXXXXXX',
  currency: 'BDT',
  currencySymbol: '৳',
};
