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
        <text transform="matrix(1 0 0 1 299.7132 229.2954)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Aliağa</text>
<text transform="matrix(1 0 0 1 307.5308 343.2203)" style={{ fontFamily: 'Tahoma', fontSize: '9px' }} className="maplabels1">Balçova</text>
<text transform="matrix(1 0 0 1 437.0374 404.1537)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Bayındır</text>
<text transform="matrix(1 0 0 1 329.6616 87.0303)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Bergama</text>
<text transform="matrix(1 0 0 1 585.0765 455.8079)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Beydağ</text>
<text transform="matrix(1 0 0 1 348.1419 321.455)" style={{ fontFamily: 'Tahoma', fontSize: '12px' }} className="maplabels1">Bornova</text>
<text transform="matrix(1 0 0 1 355.6628 365.8876)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Buca</text>
<text transform="matrix(1 0 0 1 138.3586 392.0891)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Çeşme</text>
<text transform="matrix(1 0 0 1 289.8953 325.0521)" style={{ fontFamily: 'Tahoma', fontSize: '12px' }} className="maplabels1">Çiğli</text>
<text transform="matrix(1 0 0 1 275.0827 112.8478)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Dikili</text>
<text transform="matrix(1 0 0 1 253.2453 258.9125)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Foça</text>
<text transform="matrix(1 0 0 1 329.6617 377.1931)" style={{ fontFamily: 'Tahoma', fontSize: '9px' }} className="maplabels1">G.emir</text>
<text transform="matrix(1 0 0 1 266.4752 373.5229)" style={{ fontFamily: 'Tahoma', fontSize: '9px' }} className="maplabels1">G.bahçe</text>
<text transform="matrix(1 0 0 1 165.3168 314.6174)" style={{ fontFamily: 'Tahoma', fontSize: '11px' }} className="maplabels1">Karaburun</text>
<text transform="matrix(6.914030e-02 -0.9976 0.9976 6.914030e-02 338.316 330.4543)" style={{ fontFamily: 'Tahoma', fontSize: '9px' }} className="maplabels1">K.ıyaka</text>
<text transform="matrix(1 0 0 1 397.1702 352.2954)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Kemalpaşa</text>
<text transform="matrix(1 0 0 1 381.353 141.423)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Kınık</text>
<text transform="matrix(1 0 0 1 612.0575 416.2152)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Kiraz</text>
<text transform="matrix(0.4304 -0.9026 0.9026 0.4304 336.1708 365.204)" style={{ fontFamily: 'Tahoma', fontSize: '10px' }} className="maplabels1">Konak</text>
<text transform="matrix(1 0 0 1 310.7133 450.0219)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Menderes</text>
<text transform="matrix(1 0 0 1 295.8926 281.7238)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Menemen</text>
<text transform="matrix(1 0 0 1 295.5669 363.3366)" style={{ fontFamily: 'Tahoma', fontSize: '9px' }} className="maplabels1">N.dere</text>
<text transform="matrix(1 0 0 1 517.2695 410.9549)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Ödemiş</text>
<text transform="matrix(0.4774 0.8787 -0.8787 0.4774 259.7363 398.8381)" style={{ fontFamily: 'Tahoma', fontSize: '12px' }} className="maplabels1">Seferihisar</text>
<text transform="matrix(1 0 0 1 378.7809 498.6412)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Selçuk</text>
<text transform="matrix(1 0 0 1 461.3101 452.1174)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Tire</text>
<text transform="matrix(1 0 0 1 372.7676 422.9879)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Torbalı</text>
<text transform="matrix(1 0 0 1 205.4951 392.0894)" style={{ fontFamily: 'Tahoma', fontSize: '13px' }} className="maplabels1">Urla</text>
      </svg>
    </div>
  );
};

export default IzmirMap;