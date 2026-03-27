import { Division, District, Upazila } from '@/types';

export const divisions: Division[] = [
  { id: 'div-1', name: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'div-2', name: 'Chattogram', nameBn: 'চট্টগ্রাম' },
  { id: 'div-3', name: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: 'div-4', name: 'Khulna', nameBn: 'খুলনা' },
  { id: 'div-5', name: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'div-6', name: 'Barishal', nameBn: 'বরিশাল' },
  { id: 'div-7', name: 'Rangpur', nameBn: 'রংপুর' },
  { id: 'div-8', name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
];

export const districts: District[] = [
  // Dhaka
  { id: 'dist-1', divisionId: 'div-1', name: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'dist-2', divisionId: 'div-1', name: 'Gazipur', nameBn: 'গাজীপুর' },
  { id: 'dist-3', divisionId: 'div-1', name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ' },
  { id: 'dist-4', divisionId: 'div-1', name: 'Tangail', nameBn: 'টাঙ্গাইল' },
  { id: 'dist-5', divisionId: 'div-1', name: 'Manikganj', nameBn: 'মানিকগঞ্জ' },
  { id: 'dist-6', divisionId: 'div-1', name: 'Narsingdi', nameBn: 'নরসিংদী' },
  { id: 'dist-7', divisionId: 'div-1', name: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ' },
  // Chattogram
  { id: 'dist-8', divisionId: 'div-2', name: 'Chattogram', nameBn: 'চট্টগ্রাম' },
  { id: 'dist-9', divisionId: 'div-2', name: "Cox's Bazar", nameBn: "কক্সবাজার" },
  { id: 'dist-10', divisionId: 'div-2', name: 'Comilla', nameBn: 'কুমিল্লা' },
  { id: 'dist-11', divisionId: 'div-2', name: 'Noakhali', nameBn: 'নোয়াখালী' },
  { id: 'dist-12', divisionId: 'div-2', name: 'Feni', nameBn: 'ফেনী' },
  // Rajshahi
  { id: 'dist-13', divisionId: 'div-3', name: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: 'dist-14', divisionId: 'div-3', name: 'Bogra', nameBn: 'বগুড়া' },
  { id: 'dist-15', divisionId: 'div-3', name: 'Pabna', nameBn: 'পাবনা' },
  // Khulna
  { id: 'dist-16', divisionId: 'div-4', name: 'Khulna', nameBn: 'খুলনা' },
  { id: 'dist-17', divisionId: 'div-4', name: 'Jessore', nameBn: 'যশোর' },
  { id: 'dist-18', divisionId: 'div-4', name: 'Satkhira', nameBn: 'সাতক্ষীরা' },
  // Sylhet
  { id: 'dist-19', divisionId: 'div-5', name: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'dist-20', divisionId: 'div-5', name: 'Moulvibazar', nameBn: 'মৌলভীবাজার' },
  { id: 'dist-21', divisionId: 'div-5', name: 'Habiganj', nameBn: 'হবিগঞ্জ' },
  // Barishal
  { id: 'dist-22', divisionId: 'div-6', name: 'Barishal', nameBn: 'বরিশাল' },
  { id: 'dist-23', divisionId: 'div-6', name: 'Patuakhali', nameBn: 'পটুয়াখালী' },
  // Rangpur
  { id: 'dist-24', divisionId: 'div-7', name: 'Rangpur', nameBn: 'রংপুর' },
  { id: 'dist-25', divisionId: 'div-7', name: 'Dinajpur', nameBn: 'দিনাজপুর' },
  // Mymensingh
  { id: 'dist-26', divisionId: 'div-8', name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
  { id: 'dist-27', divisionId: 'div-8', name: 'Jamalpur', nameBn: 'জামালপুর' },
];

export const upazilas: Upazila[] = [
  // Dhaka District
  { id: 'upa-1', districtId: 'dist-1', name: 'Dhanmondi', nameBn: 'ধানমন্ডি' },
  { id: 'upa-2', districtId: 'dist-1', name: 'Gulshan', nameBn: 'গুলশান' },
  { id: 'upa-3', districtId: 'dist-1', name: 'Mirpur', nameBn: 'মিরপুর' },
  { id: 'upa-4', districtId: 'dist-1', name: 'Mohammadpur', nameBn: 'মোহাম্মদপুর' },
  { id: 'upa-5', districtId: 'dist-1', name: 'Uttara', nameBn: 'উত্তরা' },
  { id: 'upa-6', districtId: 'dist-1', name: 'Banani', nameBn: 'বনানী' },
  { id: 'upa-7', districtId: 'dist-1', name: 'Motijheel', nameBn: 'মতিঝিল' },
  { id: 'upa-8', districtId: 'dist-1', name: 'Tejgaon', nameBn: 'তেজগাঁও' },
  { id: 'upa-9', districtId: 'dist-1', name: 'Badda', nameBn: 'বাড্ডা' },
  { id: 'upa-10', districtId: 'dist-1', name: 'Khilgaon', nameBn: 'খিলগাঁও' },
  // Gazipur
  { id: 'upa-11', districtId: 'dist-2', name: 'Gazipur Sadar', nameBn: 'গাজীপুর সদর' },
  { id: 'upa-12', districtId: 'dist-2', name: 'Tongi', nameBn: 'টঙ্গী' },
  { id: 'upa-13', districtId: 'dist-2', name: 'Kaliakair', nameBn: 'কালিয়াকৈর' },
  // Narayanganj
  { id: 'upa-14', districtId: 'dist-3', name: 'Narayanganj Sadar', nameBn: 'নারায়ণগঞ্জ সদর' },
  { id: 'upa-15', districtId: 'dist-3', name: 'Siddhirganj', nameBn: 'সিদ্ধিরগঞ্জ' },
  // Chattogram
  { id: 'upa-16', districtId: 'dist-8', name: 'Kotwali', nameBn: 'কোতোয়ালী' },
  { id: 'upa-17', districtId: 'dist-8', name: 'Pahartali', nameBn: 'পাহাড়তলী' },
  { id: 'upa-18', districtId: 'dist-8', name: 'Panchlaish', nameBn: 'পাঁচলাইশ' },
  { id: 'upa-19', districtId: 'dist-8', name: 'Halishahar', nameBn: 'হালিশহর' },
  // Cox's Bazar
  { id: 'upa-20', districtId: 'dist-9', name: "Cox's Bazar Sadar", nameBn: 'কক্সবাজার সদর' },
  // Comilla
  { id: 'upa-21', districtId: 'dist-10', name: 'Comilla Sadar', nameBn: 'কুমিল্লা সদর' },
  // Rajshahi
  { id: 'upa-22', districtId: 'dist-13', name: 'Rajshahi Sadar (Boalia)', nameBn: 'রাজশাহী সদর (বোয়ালিয়া)' },
  { id: 'upa-23', districtId: 'dist-13', name: 'Rajpara', nameBn: 'রাজপাড়া' },
  // Khulna
  { id: 'upa-24', districtId: 'dist-16', name: 'Khulna Sadar', nameBn: 'খুলনা সদর' },
  { id: 'upa-25', districtId: 'dist-16', name: 'Sonadanga', nameBn: 'সোনাডাঙ্গা' },
  // Sylhet
  { id: 'upa-26', districtId: 'dist-19', name: 'Sylhet Sadar', nameBn: 'সিলেট সদর' },
  { id: 'upa-27', districtId: 'dist-19', name: 'South Surma', nameBn: 'দক্ষিণ সুরমা' },
  // Barishal
  { id: 'upa-28', districtId: 'dist-22', name: 'Barishal Sadar', nameBn: 'বরিশাল সদর' },
  // Rangpur
  { id: 'upa-29', districtId: 'dist-24', name: 'Rangpur Sadar', nameBn: 'রংপুর সদর' },
  // Mymensingh
  { id: 'upa-30', districtId: 'dist-26', name: 'Mymensingh Sadar', nameBn: 'ময়মনসিংহ সদর' },
];
