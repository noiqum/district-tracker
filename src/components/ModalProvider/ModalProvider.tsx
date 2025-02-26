"use client";

import { useModalStore } from "@/lib/store/modal-store";
import React from "react";
import AdminLoginDialog from "../AdminLoginDialog/AdminLoginDialog";

export enum Modal{
    AUTH="auth"
}
interface IModalProviderProps{
    children:React.ReactNode
}

export function ModalProvider ({children}:IModalProviderProps){
    const {selectedModal,isModalOpen,closeModal}=useModalStore()
    const renderModal=()=>{
        switch (selectedModal) {
            case Modal.AUTH:
                
               return <AdminLoginDialog isOpen={true} onClose={closeModal } />
        
            default:
                break;
        }
    }
    return <div className="relative">
        {renderModal()}
        {children}
    </div>
} 