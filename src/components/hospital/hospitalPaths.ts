export type HospitalViewMode = 'public' | 'dashboard';

export function getHospitalDetailPath(slug: string, mode: HospitalViewMode): string {
  return mode === 'public' ? `/hospitals/${slug}` : `/dashboard/find-hospitals/${slug}`;
}

export function getHospitalListPath(mode: HospitalViewMode): string {
  return mode === 'public' ? '/hospitals' : '/dashboard/find-hospitals';
}
