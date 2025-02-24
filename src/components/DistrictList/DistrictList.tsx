import React from 'react';
import { TDistrict } from '@/Data/Data';
import "./DistrictList.scss"

interface DistrictListProps {
  districts: TDistrict[];
}

const DistrictList: React.FC<DistrictListProps> = ({ districts }) => {
  return (
    <div className="district-list">
      <h2>İlçeler</h2>
      <ul>
        {districts.map((district) => (
          <li key={district.id}>
            <strong>Name:</strong> {district.name || 'Unnamed'}, 
            <strong> Product:</strong> {district.product || 'N/A'}, 
            <strong> ID:</strong> {district.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DistrictList; 