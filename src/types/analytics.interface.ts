export type IAnalyticsTrend = {
  date: Date | string;
  total: number;
};

export type IAppointmentTrends = {
  total: number;
  thisMonth: number;
  lastMonth: number;
  percentage: number;
  rows: IAnalyticsTrend[];
};

export type IAppointmentStats = {
  total: number;
  pending: number;
  accepted: number;
  cancelled: number;
};

export type IHospitalAnalytics = {
  trends: IAppointmentTrends;
  stats: IAppointmentStats;
};

export type TimeRange = 'today' | 'week' | 'month' | 'year' | 'custom';

export type AnalyticsDateRangeParams = {
  startDate?: string;
  endDate?: string;
};

export type AnalyticsDateRangeParamsRequired = {
  startDate: string;
  endDate: string;
};
