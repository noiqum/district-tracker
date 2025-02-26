import { Modal } from "@/components/ModalProvider/ModalProvider";
import {create} from "zustand";
import { persist } from "zustand/middleware";

interface ModalState{
    isModalOpen:boolean;
    selectedModal:Modal | null;
    openModal:(modal:Modal)=> void;
    closeModal:()=>void;
}

export const useModalStore=create<ModalState>()(
    persist((set) => ({
        isModalOpen:false,
        selectedModal:null,

        openModal:(modal)=> {
            set({
                isModalOpen:true,
                selectedModal:modal
            })
        },
        closeModal:()=>{
            set({
                selectedModal:null,
                isModalOpen:false
            })
        }
    }),{
        name:"modal-storage",
        partialize:(state)=>({
            isModalOpen:state.isModalOpen,selectedModal:state.selectedModal
        })
    })
)

