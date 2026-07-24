import React, { JSX } from 'react';
import HospitalPanel from '@/app/dashboard/(admin)/(user)/_components/hospitalPanel';
import HospitalStats from '@/app/dashboard/(admin)/(user)/_components/hospitalStats';

const Admin = (): JSX.Element => (
  <>
    <HospitalStats />
    <HospitalPanel />
  </>
);

export default Admin;
