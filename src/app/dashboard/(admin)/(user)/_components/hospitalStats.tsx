'use client';
import { StatsCards } from '@/app/dashboard/_components/statsCards';
import { toast } from '@/hooks/use-toast';
import { hospitalStats } from '@/lib/features/hospitals/hospitalThunk';
import { useAppDispatch } from '@/lib/hooks';
import { showErrorToast } from '@/lib/utils';
import { IHospitalCountResponse, IStatsCard } from '@/types/stats.interface';
import React, { JSX, useEffect, useState } from 'react';

const HospitalStats = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [statsData, setStatsData] = useState<IStatsCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHospitalCount = async (): Promise<void> => {
      const { payload } = await dispatch(hospitalStats());
      if (payload && showErrorToast(payload)) {
        setIsLoading(false);
        toast(payload);
        return;
      }

      if (payload) {
        const {
          all,
          active,
          activeInc,
          allInc,
          deactivated,
          deactivatedInc,
          verified,
          verifiedInc,
        } = payload as IHospitalCountResponse;

        setStatsData([
          {
            title: 'Total Hospitals',
            value: all,
            percentage: allInc,
            trend: allInc >= 0 ? 'up' : 'down',
          },
          {
            title: 'Verified Hospitals',
            value: verified,
            percentage: verifiedInc,
            trend: verifiedInc >= 0 ? 'up' : 'down',
          },
          {
            title: 'Public Hospitals',
            value: active,
            percentage: activeInc,
            trend: activeInc >= 0 ? 'up' : 'down',
          },
          {
            title: 'Hidden Hospitals',
            value: deactivated,
            percentage: deactivatedInc,
            trend: deactivatedInc >= 0 ? 'up' : 'down',
          },
        ]);
      }
      setIsLoading(false);
    };
    setIsLoading(true);
    void fetchHospitalCount();
  }, [dispatch]);

  return (
    <div>
      <section className="flex items-center justify-between">
        <p className="text-[20px] font-bold sm:text-[32px]">Registered Hospitals</p>
      </section>
      <div className="mt-8 flex flex-wrap justify-evenly gap-6">
        <StatsCards statsData={statsData} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default HospitalStats;
