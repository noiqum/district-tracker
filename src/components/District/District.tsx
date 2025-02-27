import React from 'react';
import "./District.scss";
import { TDistrict } from "../../Data/Data";

interface IDistrictProps {
  district: TDistrict;
  onHover: () => void;

  isSelected: boolean;
}

enum colors{
  white="white",
  red="red",
  blue="blue"
}

export const District = ({ district, onHover, isSelected }: IDistrictProps) => {
  const handleFillColor=()=>{
    if(district.product === "med"){
      return colors.blue
    }
    if(district.product === "edge"){
      return colors.red
    }
    return colors.white
  }
  return (
    <path
      className={`district ${isSelected ? 'selected' : ''}`}
      d={district.path}
      name={district.name}
      onMouseEnter={onHover}
     fill={handleFillColor()}
    />
  );
};