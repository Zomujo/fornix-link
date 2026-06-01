import moment from 'moment';
import type {
  AnalyticsDateRangeParams,
  AnalyticsDateRangeParamsRequired,
  IAppointmentStats,
  IAppointmentTrends,
  TimeRange,
} from '@/types/analytics.interface';
import { showErrorToast } from '@/lib/utils';

export type AnalyticsTimeRangeOption = {
  value: TimeRange;
  label: string;
};

export const ANALYTICS_TIME_RANGE_OPTIONS: AnalyticsTimeRangeOption[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

export type AnalyticsDateRange = {
  startDate: Date;
  endDate: Date;
};

export function getDateRangeForTimeRange(
  timeRange: TimeRange,
  referenceDate: Date = new Date(),
): AnalyticsDateRange {
  const now = moment(referenceDate);
  let start: moment.Moment;
  let end: moment.Moment;

  switch (timeRange) {
    case 'today':
      start = now.clone().startOf('day');
      end = now.clone().endOf('day');
      break;
    case 'week':
      start = now.clone().startOf('isoWeek');
      end = now.clone().endOf('isoWeek');
      break;
    case 'year':
      start = now.clone().startOf('year');
      end = now.clone().endOf('year');
      break;
    case 'month':
    case 'custom':
    default:
      start = now.clone().startOf('month');
      end = now.clone().endOf('month');
      break;
  }

  return { startDate: start.toDate(), endDate: end.toDate() };
}

export function toAnalyticsDateRangeParams(
  startDate?: Date,
  endDate?: Date,
): AnalyticsDateRangeParams {
  const params: AnalyticsDateRangeParams = {};
  if (startDate) {
    params.startDate = startDate.toISOString();
  }
  if (endDate) {
    params.endDate = endDate.toISOString();
  }
  return params;
}

export function toAnalyticsDateRangeParamsRequired(
  startDate: Date,
  endDate: Date,
): AnalyticsDateRangeParamsRequired {
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}

export function isAppointmentTrendsPayload(payload: unknown): payload is IAppointmentTrends {
  return (
    !!payload && !showErrorToast(payload) && typeof payload === 'object' && 'rows' in payload
  );
}

export function isAppointmentStatsPayload(payload: unknown): payload is IAppointmentStats {
  return (
    !!payload &&
    !showErrorToast(payload) &&
    typeof payload === 'object' &&
    'total' in payload &&
    'pending' in payload
  );
}
