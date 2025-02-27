import React from 'react';
import "./District.scss";
import { TDistrict } from "../../Data/Data";

interface IDistrictProps {
  district: TDistrict;
  onHover?: () => void;
  onclick: () => void;
  isSelected: boolean;
}

enum colors {
  white = "white",
  red = "#662437",
  blue = "#090b3e"
}

export const District = ({ district,  isSelected, onclick }: IDistrictProps) => {
  const handleFillColor = () => {
    if (district.product === "mid") {
      return colors.blue
    }
    if (district.product === "edge") {
      return colors.red
    }
    return colors.white
  }
  return (
    <path
      className={`district ${isSelected ? 'selected' : ''}`}
      d={district.path}
      name={district.name}
      
      fill={handleFillColor()}
      onClick={onclick}
    >
      <title>{district.name}</title>
    </path>
  );
};