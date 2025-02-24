import React from 'react';
import "./District.scss";
import { TDistrict } from "../../Data/Data";

interface IDistrictProps {
  district: TDistrict;
  onHover: () => void;
  onLeave: () => void;
  onTap: () => void;
  isSelected: boolean;
}

export const District = ({ district, onHover, onLeave, onTap, isSelected }: IDistrictProps) => {
  return (
    <path
      className={`district ${isSelected ? 'selected' : ''}`}
      d={district.path}
      name={district.name}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onTap}
    />
  );
};