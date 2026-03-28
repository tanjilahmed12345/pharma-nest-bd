export type Locale = 'en' | 'bn';

const translations = {
  // Navigation
  'nav.home': { en: 'Home', bn: 'হোম' },
  'nav.shop': { en: 'Shop All', bn: 'সব পণ্য' },
  'nav.otc': { en: 'OTC Medicines', bn: 'ওটিসি ওষুধ' },
  'nav.prescription': { en: 'Prescription', bn: 'প্রেসক্রিপশন' },
  'nav.offers': { en: 'Offers', bn: 'অফার' },
  'nav.uploadRx': { en: 'Upload Prescription', bn: 'প্রেসক্রিপশন আপলোড' },
  'nav.uploadRxShort': { en: 'Upload Rx', bn: 'Rx আপলোড' },
  'nav.account': { en: 'My Account', bn: 'আমার অ্যাকাউন্ট' },
  'nav.login': { en: 'Login', bn: 'লগইন' },
  'nav.register': { en: 'Create Account', bn: 'অ্যাকাউন্ট তৈরি' },
  'nav.logout': { en: 'Logout', bn: 'লগআউট' },
  'nav.adminPanel': { en: 'Admin Panel', bn: 'অ্যাডমিন প্যানেল' },

  // Search
  'search.placeholder': { en: 'Search medicines, brands...', bn: 'ওষুধ, ব্র্যান্ড খুঁজুন...' },
  'search.minChars': { en: 'Type at least 2 characters to search', bn: 'অনুসন্ধানের জন্য কমপক্ষে ২টি অক্ষর টাইপ করুন' },
  'search.searching': { en: 'Searching...', bn: 'খুঁজছি...' },
  'search.noResults': { en: 'No results found', bn: 'কোনো ফলাফল পাওয়া যায়নি' },
  'search.viewAll': { en: 'View all results for', bn: 'সমস্ত ফলাফল দেখুন' },

  // Hero
  'hero.title': { en: 'Your Trusted Online Pharmacy in Bangladesh', bn: 'বাংলাদেশে আপনার বিশ্বস্ত অনলাইন ফার্মেসি' },
  'hero.subtitle': { en: 'Order genuine medicines online with fast delivery across Bangladesh. Verified by licensed pharmacists.', bn: 'বাংলাদেশ জুড়ে দ্রুত ডেলিভারিতে আসল ওষুধ অর্ডার করুন। লাইসেন্সধারী ফার্মাসিস্ট দ্বারা যাচাইকৃত।' },
  'hero.shopNow': { en: 'Shop Now', bn: 'এখনই কিনুন' },

  // Trust badges
  'trust.genuine': { en: 'Genuine Medicines', bn: 'আসল ওষুধ' },
  'trust.genuineDesc': { en: '100% authentic products', bn: '১০০% আসল পণ্য' },
  'trust.pharmacist': { en: 'Verified Pharmacist', bn: 'যাচাইকৃত ফার্মাসিস্ট' },
  'trust.pharmacistDesc': { en: 'Expert prescription review', bn: 'বিশেষজ্ঞ প্রেসক্রিপশন পর্যালোচনা' },
  'trust.secure': { en: 'Secure Payment', bn: 'নিরাপদ পেমেন্ট' },
  'trust.secureDesc': { en: 'bKash, Nagad, Rocket, COD', bn: 'বিকাশ, নগদ, রকেট, ক্যাশ অন ডেলিভারি' },
  'trust.delivery': { en: 'Fast Delivery', bn: 'দ্রুত ডেলিভারি' },
  'trust.deliveryDesc': { en: 'Across Bangladesh', bn: 'সারা বাংলাদেশে' },

  // Sections
  'section.shopByCategory': { en: 'Shop by Category', bn: 'ক্যাটাগরি অনুসারে কিনুন' },
  'section.browseCategories': { en: 'Browse our medicine categories', bn: 'আমাদের ওষুধের ক্যাটাগরি দেখুন' },
  'section.featuredProducts': { en: 'Featured Products', bn: 'বিশেষ পণ্য' },
  'section.popularMedicines': { en: 'Popular medicines and health essentials', bn: 'জনপ্রিয় ওষুধ ও স্বাস্থ্য সামগ্রী' },
  'section.otcMedicines': { en: 'OTC Medicines', bn: 'ওটিসি ওষুধ' },
  'section.otcDesc': { en: 'Available without prescription', bn: 'প্রেসক্রিপশন ছাড়াই পাওয়া যায়' },
  'section.rxMedicines': { en: 'Prescription Medicines', bn: 'প্রেসক্রিপশন ওষুধ' },
  'section.rxDesc': { en: 'Requires valid doctor prescription', bn: 'বৈধ ডাক্তারের প্রেসক্রিপশন প্রয়োজন' },
  'section.popularBrands': { en: 'Popular Brands', bn: 'জনপ্রিয় ব্র্যান্ড' },
  'section.trustedCompanies': { en: 'Trusted pharmaceutical companies', bn: 'বিশ্বস্ত ওষুধ কোম্পানি' },
  'section.faq': { en: 'Frequently Asked Questions', bn: 'সচরাচর জিজ্ঞাসা' },
  'section.customerReviews': { en: 'Customer Reviews', bn: 'গ্রাহক পর্যালোচনা' },
  'section.viewAll': { en: 'View All', bn: 'সব দেখুন' },

  // Product
  'product.addToCart': { en: 'Add to Cart', bn: 'কার্টে যোগ করুন' },
  'product.outOfStock': { en: 'Out of Stock', bn: 'স্টকে নেই' },
  'product.inStock': { en: 'In Stock', bn: 'স্টকে আছে' },
  'product.lowStock': { en: 'Low Stock', bn: 'কম স্টক' },
  'product.rxRequired': { en: 'Rx Required', bn: 'প্রেসক্রিপশন প্রয়োজন' },

  // Cart
  'cart.title': { en: 'Shopping Cart', bn: 'শপিং কার্ট' },
  'cart.empty': { en: 'Your cart is empty', bn: 'আপনার কার্ট খালি' },
  'cart.checkout': { en: 'Proceed to Checkout', bn: 'চেকআউটে যান' },
  'cart.continueShopping': { en: 'Continue Shopping', bn: 'শপিং চালিয়ে যান' },
  'cart.total': { en: 'Total', bn: 'মোট' },

  // Checkout
  'checkout.title': { en: 'Checkout', bn: 'চেকআউট' },
  'checkout.placeOrder': { en: 'Place Order', bn: 'অর্ডার করুন' },
  'checkout.orderSummary': { en: 'Order Summary', bn: 'অর্ডার সারসংক্ষেপ' },
  'checkout.subtotal': { en: 'Subtotal', bn: 'উপমোট' },
  'checkout.delivery': { en: 'Delivery', bn: 'ডেলিভারি' },
  'checkout.free': { en: 'Free', bn: 'ফ্রি' },
  'checkout.discount': { en: 'Discount', bn: 'ছাড়' },

  // Auth
  'auth.welcomeBack': { en: 'Welcome Back', bn: 'আবার স্বাগতম' },
  'auth.signIn': { en: 'Sign In', bn: 'সাইন ইন' },
  'auth.createAccount': { en: 'Create Account', bn: 'অ্যাকাউন্ট তৈরি করুন' },
  'auth.email': { en: 'Email', bn: 'ইমেইল' },
  'auth.password': { en: 'Password', bn: 'পাসওয়ার্ড' },
  'auth.forgotPassword': { en: 'Forgot password?', bn: 'পাসওয়ার্ড ভুলে গেছেন?' },
  'auth.noAccount': { en: "Don't have an account?", bn: 'অ্যাকাউন্ট নেই?' },
  'auth.hasAccount': { en: 'Already have an account?', bn: 'ইতিমধ্যে অ্যাকাউন্ট আছে?' },

  // Account
  'account.dashboard': { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  'account.myOrders': { en: 'My Orders', bn: 'আমার অর্ডার' },
  'account.prescriptions': { en: 'Prescriptions', bn: 'প্রেসক্রিপশন' },
  'account.addresses': { en: 'Addresses', bn: 'ঠিকানা' },
  'account.wishlist': { en: 'Wishlist', bn: 'উইশলিস্ট' },
  'account.profile': { en: 'Profile Settings', bn: 'প্রোফাইল সেটিংস' },
  'account.welcome': { en: 'Welcome', bn: 'স্বাগতম' },

  // Prescription
  'prescription.upload': { en: 'Upload Prescription', bn: 'প্রেসক্রিপশন আপলোড করুন' },
  'prescription.refill': { en: 'Request Refill', bn: 'রিফিল অনুরোধ' },
  'prescription.service': { en: 'Prescription Service', bn: 'প্রেসক্রিপশন সেবা' },
  'prescription.havePrescription': { en: 'Have a Prescription?', bn: 'প্রেসক্রিপশন আছে?' },

  // Footer
  'footer.shop': { en: 'Shop', bn: 'শপ' },
  'footer.support': { en: 'Support', bn: 'সহায়তা' },
  'footer.company': { en: 'Company', bn: 'কোম্পানি' },
  'footer.weAccept': { en: 'We Accept', bn: 'আমরা গ্রহণ করি' },
  'footer.rights': { en: 'All rights reserved.', bn: 'সর্বস্বত্ব সংরক্ষিত।' },
  'footer.builtWith': { en: 'Built with care for Bangladesh', bn: 'বাংলাদেশের জন্য যত্ন সহকারে তৈরি' },

  // Topbar
  'topbar.genuine': { en: 'Genuine Medicines | Licensed Pharmacy', bn: 'আসল ওষুধ | লাইসেন্সধারী ফার্মেসি' },

  // Common
  'common.viewAll': { en: 'View All', bn: 'সব দেখুন' },
  'common.loading': { en: 'Loading...', bn: 'লোড হচ্ছে...' },
  'common.error': { en: 'Something went wrong', bn: 'কিছু ভুল হয়েছে' },
  'common.save': { en: 'Save', bn: 'সংরক্ষণ' },
  'common.cancel': { en: 'Cancel', bn: 'বাতিল' },
  'common.delete': { en: 'Delete', bn: 'মুছুন' },
  'common.edit': { en: 'Edit', bn: 'সম্পাদনা' },
  'common.submit': { en: 'Submit', bn: 'জমা দিন' },
  'common.back': { en: 'Back', bn: 'পিছনে' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, locale: Locale): string {
  const entry = translations[key];
  return entry?.[locale] || entry?.en || key;
}

export default translations;
