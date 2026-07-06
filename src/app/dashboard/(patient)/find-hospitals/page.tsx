import React, { JSX, Suspense } from 'react';
import HospitalListView from '@/components/hospital/HospitalListView';

const FindingHospitals = (): JSX.Element => (
  <Suspense fallback={null}>
    <HospitalListView mode="dashboard" />
  </Suspense>
);

export default FindingHospitals;
