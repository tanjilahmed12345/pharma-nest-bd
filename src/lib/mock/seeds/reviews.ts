import { Review } from '@/types';

export const seedReviews: Review[] = [
  // Napa 500mg (prod-1)
  { id: 'rev-1', productId: 'prod-1', userId: 'user-cust-1', userName: 'Abdur Rahim', rating: 5, title: 'Very effective', comment: 'Works great for headache and fever. Trusted brand.', isVerifiedPurchase: true, createdAt: '2026-02-10T10:00:00Z' },
  { id: 'rev-2', productId: 'prod-1', userId: 'user-cust-2', userName: 'Fatema Begum', rating: 4, title: 'Good quality', comment: 'Reliable paracetamol. Quick delivery from PharmaNest.', isVerifiedPurchase: true, createdAt: '2026-02-15T14:30:00Z' },
  { id: 'rev-3', productId: 'prod-1', userId: 'user-cust-3', userName: 'Kamal Hossain', rating: 5, title: 'Best paracetamol', comment: 'Always keep this at home. Works within 30 minutes.', isVerifiedPurchase: false, createdAt: '2026-03-01T09:00:00Z' },

  // Napa Extra (prod-2)
  { id: 'rev-4', productId: 'prod-2', userId: 'user-cust-1', userName: 'Abdur Rahim', rating: 4, title: 'Strong pain relief', comment: 'Better than regular Napa for severe headaches. The caffeine helps.', isVerifiedPurchase: true, createdAt: '2026-02-20T11:00:00Z' },

  // Ace 500mg (prod-3)
  { id: 'rev-5', productId: 'prod-3', userId: 'user-cust-2', userName: 'Fatema Begum', rating: 5, title: 'Trusted medicine', comment: 'Square Pharma never disappoints. Fast acting.', isVerifiedPurchase: true, createdAt: '2026-01-28T16:00:00Z' },
  { id: 'rev-6', productId: 'prod-3', userId: 'user-cust-3', userName: 'Kamal Hossain', rating: 4, title: 'Good alternative', comment: 'Works just as well as Napa. Good price.', isVerifiedPurchase: false, createdAt: '2026-02-05T08:45:00Z' },

  // Histacin (prod-4)
  { id: 'rev-7', productId: 'prod-4', userId: 'user-cust-1', userName: 'Abdur Rahim', rating: 4, title: 'Stops allergy fast', comment: 'Takes care of my seasonal allergies. Makes me a bit drowsy though.', isVerifiedPurchase: true, createdAt: '2026-03-05T12:00:00Z' },

  // Antacid Plus (prod-5)
  { id: 'rev-8', productId: 'prod-5', userId: 'user-cust-2', userName: 'Fatema Begum', rating: 5, title: 'Instant relief', comment: 'Best antacid suspension. Works instantly for acidity.', isVerifiedPurchase: true, createdAt: '2026-02-25T19:00:00Z' },

  // ORSaline (prod-6)
  { id: 'rev-9', productId: 'prod-6', userId: 'user-cust-1', userName: 'Abdur Rahim', rating: 5, title: 'Essential for home', comment: 'Must have for every household. Great taste and effective.', isVerifiedPurchase: true, createdAt: '2026-03-10T07:30:00Z' },
  { id: 'rev-10', productId: 'prod-6', userId: 'user-cust-3', userName: 'Kamal Hossain', rating: 5, title: 'Life saver', comment: 'Saved my kid during food poisoning. Always keep stock.', isVerifiedPurchase: true, createdAt: '2026-03-12T15:00:00Z' },

  // Seclo 20mg (prod-7)
  { id: 'rev-11', productId: 'prod-7', userId: 'user-cust-2', userName: 'Fatema Begum', rating: 4, title: 'Good for ulcer', comment: 'Doctor prescribed this. Works well for acid reflux.', isVerifiedPurchase: true, createdAt: '2026-02-18T10:15:00Z' },

  // Ceevit (prod-13)
  { id: 'rev-12', productId: 'prod-13', userId: 'user-cust-1', userName: 'Abdur Rahim', rating: 4, title: 'Daily vitamin C', comment: 'Good for immunity. Affordable price.', isVerifiedPurchase: true, createdAt: '2026-03-08T13:00:00Z' },
  { id: 'rev-13', productId: 'prod-13', userId: 'user-cust-2', userName: 'Fatema Begum', rating: 5, title: 'Keeps me healthy', comment: 'Taking this daily. No cold or flu since I started.', isVerifiedPurchase: true, createdAt: '2026-03-15T11:30:00Z' },

  // Savlon (prod-16)
  { id: 'rev-14', productId: 'prod-16', userId: 'user-cust-3', userName: 'Kamal Hossain', rating: 5, title: 'Household essential', comment: 'Use it for all cuts and wounds. Very effective antiseptic.', isVerifiedPurchase: false, createdAt: '2026-02-28T09:45:00Z' },

  // Dettol (prod-17)
  { id: 'rev-15', productId: 'prod-17', userId: 'user-cust-1', userName: 'Abdur Rahim', rating: 4, title: 'Classic antiseptic', comment: 'Trusted brand. Use it regularly for sanitizing.', isVerifiedPurchase: true, createdAt: '2026-03-02T17:00:00Z' },

  // Glucometer (prod-23)
  { id: 'rev-16', productId: 'prod-23', userId: 'user-cust-2', userName: 'Fatema Begum', rating: 5, title: 'Accurate readings', comment: 'Easy to use at home. Results match lab tests. Highly recommend.', isVerifiedPurchase: true, createdAt: '2026-03-18T14:00:00Z' },

  // BP Monitor (prod-25)
  { id: 'rev-17', productId: 'prod-25', userId: 'user-cust-1', userName: 'Abdur Rahim', rating: 5, title: 'Must have device', comment: 'My parents use it daily. Very accurate and easy to read.', isVerifiedPurchase: true, createdAt: '2026-03-20T08:00:00Z' },
  { id: 'rev-18', productId: 'prod-25', userId: 'user-cust-3', userName: 'Kamal Hossain', rating: 4, title: 'Good quality', comment: 'Omron is a trusted brand. Works perfectly.', isVerifiedPurchase: false, createdAt: '2026-03-22T10:30:00Z' },
];
