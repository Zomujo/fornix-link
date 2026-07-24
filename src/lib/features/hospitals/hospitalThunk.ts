import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { axiosErrorHandler } from '@/lib/axios';
import { IPagination, IQueryParams, IResponse } from '@/types/shared.interface';
import {
  IHospital,
  IHospitalProfile,
  INearByQueryParams,
  IHospitalListItem,
  IHospitalDetail,
  IHospitalNamedEntity,
} from '@/types/hospital.interface';
import { AcceptDeclineStatus } from '@/types/shared.enum';
import { Toast } from '@/hooks/use-toast';
import { generateSuccessToast, getValidQueryString } from '@/lib/utils';
import { buildHospitalOrgFormData } from '@/lib/utils/formDataUtils';
import { IHospitalCountResponse } from '@/types/stats.interface';

export const getHospitals = createAsyncThunk(
  'hospitals/getHospitals',
  async ({ page, search, status, pageSize }: IQueryParams<AcceptDeclineStatus | ''>) => {
    // Endpoint does not accept empty status
    const query = status ? `&status=${status}` : '';
    try {
      const { data } = await axios.get<IResponse<IPagination<IHospital>>>(
        `common/orgs?page=${page}&search=${search}&pageSize=${pageSize}${query}`,
      );
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const getHospital = createAsyncThunk(
  'hospitals/getHospital',
  async (id: string): Promise<Toast | IHospital> => {
    try {
      const { data } = await axios.get<IResponse<IHospital>>(`orgs/${id}`);
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const getNearByHospitals = createAsyncThunk(
  'hospitals/getNearByHospitals',
  async ({ long, lat, radius }: INearByQueryParams) => {
    try {
      const { data } = await axios.get<IResponse<IHospital>>(
        `orgs/nearby?lat=${lat}&long=${long}&radius=${radius}`,
      );
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const updateHospitalDetails = createAsyncThunk(
  'hospitals/updateHospitalDetails',
  async (hospitalProfile: Partial<IHospitalProfile>): Promise<Toast> => {
    try {
      const hasFiles =
        (Array.isArray(hospitalProfile.images) &&
          hospitalProfile.images.some((v) => v instanceof File)) ||
        hospitalProfile.image instanceof File;

      // Use FormData when we have files, an imageOrder (gallery sync/reorder), or a logo
      // clear (image === null). The multipart PATCH is the only path where the controller
      // reads clearLogo / gallery-sync signals; the JSON path drops them.
      const clearsLogo = hospitalProfile.image === null;
      if (hasFiles || hospitalProfile.imageOrder !== undefined || clearsLogo) {
        const formData = buildHospitalOrgFormData(hospitalProfile as Record<string, unknown>);
        // Use patch + multipart header (same pattern as profile-picture uploads).
        // Passing FormData to patchForm is fine, but explicit headers match working upload paths.
        const { data } = await axios.patch<IResponse<IHospitalProfile>>('orgs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return generateSuccessToast(data.message);
      }
      // No files and no imageOrder: send JSON so null values are preserved (PATCH semantics)
      const { data } = await axios.patch<IResponse<IHospitalProfile>>('orgs', hospitalProfile, {
        headers: { 'Content-Type': 'application/json' },
      });
      return generateSuccessToast(data.message);
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const updateHospitalVisibility = createAsyncThunk(
  'hospitals/updateHospitalVisibility',
  async ({ isActive }: { isActive: boolean }): Promise<Toast> => {
    try {
      const { data } = await axios.patch<IResponse>(
        'orgs',
        { isActive },
        { headers: { 'Content-Type': 'application/json' } },
      );
      return generateSuccessToast(data.message);
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

// New hospital API thunks for the new hospital model
export const getAllHospitals = createAsyncThunk(
  'hospitals/allHospitals',
  async ({
    pageSize,
    ...rest
  }: IQueryParams<AcceptDeclineStatus | ''> & {
    city?: string;
    nearMe?: boolean;
    organizationType?: string;
    hasEmergency?: boolean;
    telemedicine?: boolean;
    serviceId?: string;
    departmentId?: string;
    insuranceCompanyId?: string;
    languages?: string[];
    isActive?: boolean;
    minConsultationFee?: number;
    maxConsultationFee?: number;
    openNow?: boolean;
    open24_7?: boolean;
    onsitePharmacy?: boolean;
    onsiteLabs?: boolean;
    ambulanceServices?: boolean;
  }): Promise<IPagination<IHospitalListItem> | Toast> => {
    try {
      const { data } = await axios.get<IResponse<IPagination<IHospitalListItem>>>(
        `hospitals?${getValidQueryString(rest)}&pageSize=${pageSize || 10}`,
      );
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const getAllHospitalsAdmin = createAsyncThunk(
  'hospitals/allHospitalsAdmin',
  async ({
    pageSize,
    status,
    ...rest
  }: IQueryParams<AcceptDeclineStatus | ''> & {
    isActive?: boolean;
  }): Promise<IPagination<IHospitalListItem> | Toast> => {
    try {
      let isActive = rest.isActive;
      if (status === AcceptDeclineStatus.Accepted) {
        isActive = true;
      } else if (status === AcceptDeclineStatus.Deactivated) {
        isActive = false;
      }
      const { isActive: _ignored, ...queryRest } = rest;
      const params = new URLSearchParams(getValidQueryString(queryRest));
      params.set('pageSize', String(pageSize || 10));
      if (isActive !== undefined) {
        params.set('isActive', String(isActive));
      }
      const { data } = await axios.get<IResponse<IPagination<IHospitalListItem>>>(
        `hospitals/admin/list?${params.toString()}`,
      );
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const getHospitalByIdAdmin = createAsyncThunk(
  'hospitals/getHospitalByIdAdmin',
  async (id: string): Promise<IHospitalDetail | Toast> => {
    try {
      const { data } = await axios.get<IResponse<IHospitalDetail>>(`hospitals/admin/${id}`);
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const activateHospital = createAsyncThunk(
  'hospitals/activateHospital',
  async (id: string): Promise<Toast> => {
    try {
      const { data } = await axios.patch<IResponse>(`hospitals/admin/${id}/activate`);
      return generateSuccessToast(data.message);
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const deactivateHospital = createAsyncThunk(
  'hospitals/deactivateHospital',
  async (id: string): Promise<Toast> => {
    try {
      const { data } = await axios.delete<IResponse>(`hospitals/admin/${id}/deactivate`);
      return generateSuccessToast(data.message);
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const hospitalStats = createAsyncThunk(
  'hospitals/hospitalStats',
  async (): Promise<Toast | IHospitalCountResponse> => {
    try {
      const { data } = await axios.get<IResponse<IHospitalCountResponse>>(
        'dashboard/hospital-count',
      );
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const getHospitalBySlug = createAsyncThunk(
  'hospitals/getHospitalBySlug',
  async (slug: string): Promise<IHospitalDetail | Toast> => {
    try {
      const { data } = await axios.get<IResponse<IHospitalDetail>>(`hospitals/${slug}`);
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const getMyHospital = createAsyncThunk(
  'hospitals/getMyHospital',
  async (): Promise<IHospitalDetail | Toast> => {
    try {
      const { data } = await axios.get<IResponse<IHospitalDetail>>('hospitals/me');
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

// Fetch services for filtering
export const getServices = createAsyncThunk(
  'hospitals/getServices',
  async (): Promise<Array<{ id: string; name: string }> | Toast> => {
    try {
      const { data } =
        await axios.get<
          IResponse<Array<{ id: string; name: string; description?: string; category?: string }>>
        >('common/services');
      return data.data.map((service) => ({ id: service.id, name: service.name }));
    } catch (error) {
      try {
        const { data } =
          await axios.get<IResponse<Array<{ id: string; name: string }>>>('services');
        return data.data;
      } catch (innerError) {
        return axiosErrorHandler(error ?? innerError, true) as Toast;
      }
    }
  },
);

// Fetch departments for filtering
export const getDepartments = createAsyncThunk(
  'hospitals/getDepartments',
  async (): Promise<IHospitalNamedEntity[] | Toast> => {
    try {
      const { data } = await axios.get<IResponse<IHospitalNamedEntity[]>>('common/departments');
      return data.data;
    } catch (error) {
      try {
        const { data } = await axios.get<IResponse<IHospitalNamedEntity[]>>('departments');
        return data.data;
      } catch (innerError) {
        return axiosErrorHandler(error ?? innerError, true) as Toast;
      }
    }
  },
);

// Fetch insurance companies for filtering
export const getInsuranceCompanies = createAsyncThunk(
  'hospitals/getInsuranceCompanies',
  async (): Promise<Array<{ id: string; name: string }> | Toast> => {
    try {
      const { data } = await axios.get<
        IResponse<Array<{ id: string; name: string; code?: string; logo?: string }>>
      >('common/insurance-companies');
      return data.data.map((company) => ({ id: company.id, name: company.name }));
    } catch (error) {
      try {
        const { data } =
          await axios.get<IResponse<Array<{ id: string; name: string }>>>('insurance-companies');
        return data.data;
      } catch (innerError) {
        return axiosErrorHandler(error ?? innerError, true) as Toast;
      }
    }
  },
);
