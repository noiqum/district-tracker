"use client";

import React, { useEffect, useState } from 'react';
import "./IzmirMap.scss";
import {  TDistrict } from '@/Data/Data';
import { District } from '../District/District';
import {supabase} from "@/lib/supabase/supabase"
import {Edit2} from "lucide-react"
import { useAuthStore } from '@/lib/store/auth-store';
import { useModalStore } from '@/lib/store/modal-store';
import { Modal } from '../ModalProvider/ModalProvider';
import { useDistrictStore } from '@/lib/store/district-store';
import edgeProfile from "../../../public/edge.png";
import medProfile from "../../../public/med.png";
import Image from 'next/image';

interface IzmirMapProps{
  classname:string,
  districtList:TDistrict[]
}

const IzmirMap = ({ classname,districtList }: IzmirMapProps) => {
 
  const [districts,setDistricts]=useState<TDistrict[]>(districtList)
  const {isAuthenticated,isAdmin}=useAuthStore()
  const {openModal}=useModalStore()
  const {selectedDistrict,setSelectedDistrict}=useDistrictStore()

  const updateBtnHandler=()=>{
    if(isAuthenticated && isAdmin) {
      return  openModal(Modal.UPDATE_DISTRICT)
    }
    openModal(Modal.AUTH)
  }

  useEffect(() => {
  
    // Real-time subscription
    const subscription = supabase
      .channel('districts')
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
  const handleClicked = (district: TDistrict) => {
    setSelectedDistrict(district)
  }
 


  return (
    <div className={`map-container ${classname || ''}`}>
      {selectedDistrict && (
        <div className="info-box">
          <h3>{selectedDistrict.name}</h3>
          <p>Product: {selectedDistrict.product || 'N/A'}</p>
          {(selectedDistrict.product === "mid" || selectedDistrict.product === "edge")? <span>
            <Image className='min-w-[50px]' src={selectedDistrict.product === "mid" ? medProfile : edgeProfile} alt="profile" width={50} height={50} />
          </span>: null}
          <button onClick={updateBtnHandler} className='flex items-center h-10 w-min-content px-4 bg-[#0E2367] rounded-full transition-all duration-300 ease-in-out hover:shadow-md mt-4'>Güncelle 
            <Edit2 className='ml-2' size={14}></Edit2>
          </button>
        </div>
      )}

      <svg
        baseProfile="tiny"
        fill="#ececec"
        stroke="lightgray"
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
            onclick={() => handleClicked(district)} 
            isSelected={selectedDistrict?.id === district.id}
          />
        ))}
      </svg>
    </div>
  );
};

export default IzmirMap;