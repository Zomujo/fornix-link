import React, { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Pill } from 'lucide-react';
import { IConsultationDetails } from '@/types/consultation.interface';

interface PrescriptionsSectionProps {
  consultationDetails: IConsultationDetails | undefined;
}

export const PrescriptionsSection = ({
  consultationDetails,
}: PrescriptionsSectionProps): JSX.Element => {
  const prescriptions = consultationDetails?.prescriptions ?? [];
  const prescriptionUrl = consultationDetails?.prescriptionUrl?.trim();
  const hasPrescriptions = prescriptions.length > 0;
  const hasPdf = Boolean(prescriptionUrl);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Pill className="text-primary" />
          Prescriptions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasPrescriptions ? (
          <div className="space-y-3">
            {prescriptions.map((prescription, index) => (
              <div
                key={prescription.name ? `${prescription.name}-${index}` : index}
                className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
              >
                <p className="font-semibold text-gray-900">{prescription.name}</p>
                <p className="text-sm text-gray-500">
                  {[prescription.doses, prescription.route, prescription.doseRegimen]
                    .filter(Boolean)
                    .join(' · ')}
                  {prescription.numOfDays ? ` for ${prescription.numOfDays} days` : ''}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center text-gray-500">
            There is currently no prescription from the doctor.
          </div>
        )}

        {hasPdf && (
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary-light hover:text-primary"
            child={
              <a href={prescriptionUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                View Prescription
              </a>
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
