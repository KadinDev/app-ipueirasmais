export type UsefulServiceType =
  | "pharmacy"
  | "hospital"
  | "samu"
  | "police"
  | "firefighters"
  | "city_hall"
  | "enel"
  | "cagece"
  | "other";

export type UsefulService = {
  id: string;
  cityId: string;
  serviceType: UsefulServiceType;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  addressLine: string | null;
  latitude: number | null;
  longitude: number | null;
  note: string | null;
  manualPriority: number;
  createdAt: string | null;
  updatedAt: string | null;
};
