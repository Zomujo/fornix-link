/**
 * How far ahead patients can pick a preferred date for hospital appointments.
 * Hospital bookings do not use doctor time slots, so dates are not loaded from the API.
 */
export const HOSPITAL_APPOINTMENT_BOOKING_WINDOW_DAYS = 90;

/**
 * Builds the list of calendar days shown as selectable for a hospital appointment.
 *
 * Doctor bookings call the slots API and only enable dates with availability.
 * Hospital bookings only need a preferred visit date, so every day in this window
 * is treated as selectable on the client.
 */
export function getHospitalAppointmentSelectableDates(
  fromDate: Date = new Date(),
): Date[] {
  return Array.from({ length: HOSPITAL_APPOINTMENT_BOOKING_WINDOW_DAYS }, (_, dayOffset) => {
    const selectableDate = new Date(fromDate);
    selectableDate.setDate(fromDate.getDate() + dayOffset);
    return selectableDate;
  });
}
