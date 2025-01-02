export interface DistanceCalculation {
  distanceText: string;
  totalCost: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  pickup: string;
  dropoff: string;
  date: Date;
  time: string;
  passengers: string;
}

export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
  phone: string | null;
}