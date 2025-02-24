'use client';
// components/ViewContainer.tsx
import { useState, useEffect } from 'react';

import { useNavigation,View } from '@/context/NavigationContex';
import IzmirMap from '@/components/IzmirMap/IzmirMap';
import DistrictsList from '@/components/DistrictList/DistrictList';
import { TDistrict } from '@/Data/Data';
import { supabase } from '@/lib/supabase/supabase';


interface ViewContainerProps {
  initialDistricts: TDistrict[];
}

export default function ViewContainer({ initialDistricts }: ViewContainerProps) {
  const [districts, setDistricts] = useState<TDistrict[]>(initialDistricts);

  const { currentView} = useNavigation();

  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel('districts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'districts' },
        async () => {
          const { data } = await supabase.from('districts').select('*');
          if (data) setDistricts(data as TDistrict[]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {/* Both components are always rendered, but only one is visible */}
      <div 
        className="absolute w-full transition-all duration-500 ease-in-out"
        style={{ 
          transform: currentView === View.MAP ? 'translateX(0)' : 'translateX(-100%)',
          opacity: currentView === View.MAP ? 1 : 0
        }}
      >
        <IzmirMap classname='' districtList={districts} />
      </div>
      
      <div 
        className="absolute w-full transition-all duration-500 ease-in-out"
        style={{ 
          transform: currentView === View.LIST ? 'translateX(0)' : 'translateX(100%)', 
          opacity: currentView === View.LIST ? 1 : 0
        }}
      >
        <DistrictsList districts={districts} />
      </div>
    </div>
  );
  
}