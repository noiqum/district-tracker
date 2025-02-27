import React from 'react';
import { TDistrict } from '@/Data/Data';
import "./DistrictList.scss"
import edgeProfile from "../../../public/edge.png";
import medProfile from "../../../public/med.png";

interface DistrictListProps {
  districts: TDistrict[];
}

const DistrictList: React.FC<DistrictListProps> = ({ districts }) => {
  return (
    <div className="district-list">
      <div className='district-list_head'>
      <h2>İlçeler</h2>
      </div>
      
      <ul>
        {districts.map((district) => (
          <li className={`${district.product === "mid" ? "mid" : district.product === "edge" ? "edge" :""}`} key={district.id}>
            <strong>Name:</strong> {district.name || 'Unnamed'}, 
            <strong> Product:</strong> {district.product || 'N/A'}, 
            <strong> ID:</strong> {district.id}
            {district.product === "edge" && <img className='w-8 h-8' src={edgeProfile.src} alt="edge" />}
            {district.product === "mid" && <img className='w-8 h-8 '  src={medProfile.src} alt="med" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DistrictList; 