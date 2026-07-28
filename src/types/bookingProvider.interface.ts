export type BookingProviderType = 'doctor' | 'hospital';

export interface IBookingProvider {
  type: BookingProviderType;
  id: string;
  name: string;
  fee: number;
  image?: string | null;
  subtitle?: string;
}
