"use client";

import React, { useEffect, useState } from 'react';
import "./IzmirMap.scss";
import {  TDistrict } from '@/Data/Data';
import { District } from '../District/District';
import {supabase} from "@/lib/supabase/supabase"

interface IzmirMapProps{
  classname:string,
  districtList:TDistrict[]
}

const IzmirMap = ({ classname,districtList }: IzmirMapProps) => {
  const [selectedDistrict, setSelectedDistrict] = useState<TDistrict | null>(null);
  const [districts,setDistricts]=useState<TDistrict[]>(districtList)

  useEffect(() => {
   /*  const fetchDistricts = async () => {
      const { data, error } = await supabase.from('districts').select('*');
      if (error) {
        console.error('Error fetching districts:', error.message);
        return;
      }
      setDistricts(data as TDistrict[]); // Type assertion since TDistrict matches DistrictRow
    };
    fetchDistricts(); */

    // Real-time subscription
    const subscription = supabase
      .channel('public:districts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'districts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setDistricts((prev) => [...prev, payload.new as TDistrict]);
        } else if (payload.eventType === 'UPDATE') {
          setDistricts((prev) =>
            prev.map((d) => (d.id === (payload.new as TDistrict).id ? (payload.new as TDistrict) : d))
          );
        } else if (payload.eventType === 'DELETE') {
          setDistricts((prev) => prev.filter((d) => d.id !== (payload.old as { id: number }).id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleHover = (district: TDistrict) => {
   console.log("district",district)
    setSelectedDistrict(district)
  };

  const handleLeave = () => {
    // Clear only if not selected via tap
    console.log("leave")
    
  };


  return (
    <div className={`map-container ${classname || ''}`}>
      {selectedDistrict && (
        <div className="info-box">
          <h3>{selectedDistrict.name}</h3>
          <p>Product: {selectedDistrict.id || 'N/A'}</p>
        </div>
      )}

      <svg
        baseProfile="tiny"
        fill="#ececec"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".2"
        version="1.2"
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        id="map"
        data-testid="map"
      >
        <rect width="100%" height="100%" fill="transparent" />
        {districts.map((district, index) => (
          <District
            key={district.name + index}
            district={district}
            onHover={() => handleHover(district)}
            onLeave={handleLeave}
            onTap={() =>console.log("tap")}
            isSelected={selectedDistrict?.id === district.id}
          />
        ))}
      </svg>
    </div>
  );
};

export default IzmirMap;