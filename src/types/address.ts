export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  division: string;
  district: string;
  upazila: string;
  postcode: string;
  area: string;
  addressLine: string;
  houseFlat: string;
  landmark?: string;
  deliveryNote?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Division {
  id: string;
  name: string;
  nameBn: string;
}

export interface District {
  id: string;
  divisionId: string;
  name: string;
  nameBn: string;
}

export interface Upazila {
  id: string;
  districtId: string;
  name: string;
  nameBn: string;
}
