import { TDistrict } from "@/Data/Data";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../supabase/supabase";


interface IDistrictStoreState{
    selectedDistrict:TDistrict  | null,
    updateDistrict:(name:string,product:string,id:number)=>Promise<{
        success:boolean,
        error:null | string
    }>,
    setSelectedDistrict:(district:TDistrict)=>void
}

export const useDistrictStore=create<IDistrictStoreState>()(
    persist((set, get)=>({
        selectedDistrict: null as TDistrict | null,

        updateDistrict: async (name: string, product: string, id: number): Promise<{ success: boolean; error: string | null }> => {
            try {
                const { data, error } = await supabase
                    .from("districts")
                    .update({ name, product })
                    .eq('id', id);
                if(data){
                    console.log("data update",data)
                }
                if (error) {
                    return { success: false, error: error.message || "hata oluştu" };
                }

                // Update the selectedDistrict state after a successful update
                set({ selectedDistrict: { name, product, id, path: get().selectedDistrict?.path || '' } });
                return { success: true, error: null };
            } catch (error) {
                console.error("Error updating district:", error);
                return { success: false, error: "Error updating district" };
            }
        },

        setSelectedDistrict:(district)=>{
            set({
                selectedDistrict:{...district}
            })
        }
    }),{
        name:"district-storage",
        partialize:(state)=>({selectedDistrict:state.selectedDistrict})
    })
)