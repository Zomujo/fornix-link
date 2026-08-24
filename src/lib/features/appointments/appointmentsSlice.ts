import { IAppointment, IPostInvestigationData } from '@/types/appointment.interface';
import { AppointmentStatus } from '@/types/appointmentStatus.enum';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getConsultationAppointment } from '@/lib/features/appointments/consultation/consultationThunk';
import {
  acceptAppointment,
  cancelAppointment,
  declineAppointment,
  reopenAppointment,
} from '@/lib/features/appointments/appointmentsThunk';
import { IConsultationSymptoms } from '@/types/consultation.interface';
import { IDiagnosisResponse } from '@/types/medical.interface';
import { showErrorToast } from '@/lib/utils';
import { Toast } from '@/hooks/use-toast';

export type AppointmentListPatch = {
  id: string;
  status?: AppointmentStatus;
  doctor?: IAppointment['doctor'];
  doctorId?: string | null;
  meetingLink?: string | null;
};

export type RemoteAppointmentChange = {
  patch: AppointmentListPatch;
  appointment?: IAppointment;
};

interface AppointmentsState {
  appointment: IAppointment | undefined;
  isLoading: boolean;
  showReviewModal: boolean;
  reviewAppointmentId: string | undefined;
  pendingRequests: IAppointment[];
  listRevision: number;
  lastAppointmentPatch: AppointmentListPatch | null;
}
const initialState: AppointmentsState = {
  appointment: undefined,
  isLoading: false,
  showReviewModal: false,
  reviewAppointmentId: undefined,
  pendingRequests: [],
  listRevision: 0,
  lastAppointmentPatch: null,
};

const applySuccessfulStatusMutation = (
  state: AppointmentsState,
  payload: Toast,
  id: string,
): void => {
  if (showErrorToast(payload)) {
    return;
  }
  state.pendingRequests = state.pendingRequests.filter((request) => request.id !== id);
  state.listRevision += 1;
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointment: (state, action: PayloadAction<IAppointment>) => {
      state.appointment = action.payload;
    },
    updateAppointmentNotes: (state, action: PayloadAction<string>) => {
      if (state.appointment) {
        state.appointment.notes = action.payload;
      }
    },
    updateAppointmentHistoryNotes: (state, action: PayloadAction<string>) => {
      if (state.appointment) {
        state.appointment.historyNotes = action.payload;
      }
    },
    updateDiagnosis: (state, action: PayloadAction<IDiagnosisResponse[]>) => {
      if (state.appointment) {
        state.appointment.diagnosis = action.payload;
      }
    },
    updateSymptoms: (state, action: PayloadAction<IConsultationSymptoms>) => {
      if (state.appointment) {
        state.appointment.symptoms = {
          ...state.appointment.symptoms,
          ...action.payload,
        };
      }
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      if (state.appointment) {
        state.appointment.isAuthenticated = action.payload;
      }
    },
    updatePostInvestigationData: (state, action: PayloadAction<IPostInvestigationData>) => {
      if (state.appointment) {
        state.appointment.ipData = JSON.stringify(action.payload);
      }
    },
    updateAppointmentLinkId: (state, action: PayloadAction<string | null>) => {
      if (state.appointment) {
        state.appointment.appointmentLinkId = action.payload;
      }
    },
    showReviewModal: (state, action: PayloadAction<{ appointmentId: string }>) => {
      state.showReviewModal = true;
      state.reviewAppointmentId = action.payload.appointmentId;
    },
    hideReviewModal: (state) => {
      state.showReviewModal = false;
      state.reviewAppointmentId = undefined;
    },
    setPendingRequests: (state, action: PayloadAction<IAppointment[]>) => {
      state.pendingRequests = action.payload;
    },
    addPendingRequest: (state, action: PayloadAction<IAppointment>) => {
      const incoming = action.payload;
      state.pendingRequests = [
        incoming,
        ...state.pendingRequests.filter((request) => request.id !== incoming.id),
      ];
    },
    removePendingRequest: (state, action: PayloadAction<string>) => {
      state.pendingRequests = state.pendingRequests.filter(
        (request) => request.id !== action.payload,
      );
    },
    applyRemoteAppointmentChange: (state, action: PayloadAction<RemoteAppointmentChange>) => {
      const { patch, appointment } = action.payload;
      state.lastAppointmentPatch = patch;
      state.listRevision += 1;

      if (
        appointment &&
        (!appointment.status || appointment.status === AppointmentStatus.Pending)
      ) {
        state.pendingRequests = [
          appointment,
          ...state.pendingRequests.filter((request) => request.id !== appointment.id),
        ];
        return;
      }

      if (patch.status && patch.status !== AppointmentStatus.Pending) {
        state.pendingRequests = state.pendingRequests.filter((request) => request.id !== patch.id);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConsultationAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConsultationAppointment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getConsultationAppointment.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(acceptAppointment.fulfilled, (state, action) => {
        applySuccessfulStatusMutation(state, action.payload, action.meta.arg);
      })
      .addCase(declineAppointment.fulfilled, (state, action) => {
        applySuccessfulStatusMutation(state, action.payload, action.meta.arg);
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        applySuccessfulStatusMutation(state, action.payload, action.meta.arg);
      })
      .addCase(reopenAppointment.fulfilled, (state, action) => {
        if (!showErrorToast(action.payload)) {
          state.listRevision += 1;
        }
      });
  },
});

export const {
  setAppointment,
  updateSymptoms,
  setIsAuthenticated,
  showReviewModal,
  hideReviewModal,
  updateAppointmentNotes,
  updateAppointmentHistoryNotes,
  updateDiagnosis,
  updatePostInvestigationData,
  updateAppointmentLinkId,
  setPendingRequests,
  addPendingRequest,
  removePendingRequest,
  applyRemoteAppointmentChange,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
