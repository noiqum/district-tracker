import React from 'react';
import { TDistrict } from '@/Data/Data';
import "./DistrictList.scss"
import edgeProfile from "../../../public/edge.png";
import medProfile from "../../../public/med.png";
import { Edit2 } from 'lucide-react';
import { useModalStore } from '@/lib/store/modal-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { Modal } from '../ModalProvider/ModalProvider';

interface DistrictListProps {
  districts: TDistrict[];
}

const DistrictList: React.FC<DistrictListProps> = ({ districts }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const { openModal } = useModalStore();
  const updateBtnHandler=()=>{
      if(isAuthenticated && isAdmin) {
        return  openModal(Modal.UPDATE_DISTRICT)
      }
      openModal(Modal.AUTH)
    }
  return (
    <div className="district-list">
      <div className='district-list_head'>
        <h2>İlçeler</h2>
      </div>

      <ul>
        {districts.filter(elm=>elm.name !== "").map((district) => (
          <li onClick={updateBtnHandler} className={`${district.product === "mid" ? "mid" : district.product === "edge" ? "edge" : ""}`} key={district.id}>
           
              {district.product === "edge" && <img className='w-8 h-8 inline-block mx-2' src={edgeProfile.src} alt="edge" />}
              {district.product === "mid" && <img className='w-8 h-8 inline-block mx-2' src={medProfile.src} alt="med" />}
              {district.product !== "edge"   && district.product !== "mid" && <span className='flex min-w-8 min-h-8 bg-gray-300 mx-2 rounded-sm'></span>}
            <strong>İlçe</strong> <span className='capitalize mx-2'>{district.name || 'Unnamed'}</span>,
            <strong className='mx-2'>Ürün:</strong> <span className='product'>{district.product || 'N/A'}</span> ,
            <span className='ml-auto border-gray-700 rounded-md p-1 hover:bg-gray-400'>
              <Edit2 size={18}></Edit2>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DistrictList; 