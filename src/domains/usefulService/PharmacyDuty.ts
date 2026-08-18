export type PharmacyDuty = {
  shiftId: string;
  cityId: string;
  startsAt: string;
  endsAt: string;
  note: string | null;
  pharmacyId: string;
  companyId: string | null;
  name: string;
  slug: string;
  whatsapp: string | null;
  phone: string | null;
  addressLine: string | null;
  neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;
  logoUrl: string | null;
  manualPriority: number;
};
