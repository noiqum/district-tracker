
import IzmirMap from "@/components/IzmirMap/IzmirMap";
import { supabase } from "@/lib/supabase/supabase";
import NavigationControls from "@/components/NavigationControls/NavigationControls";
import ViewContainer from "@/components/ViewContainer/ViewContainer";

export default async function Home() {

  const {data:districtList,error}= await supabase.from("districts").select("*")
  if(error){
    return <div className="bg-slate-700 w-screen h-screen flex justify-center items-center">
      <p>Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz</p>
    </div>
  }
  return (
    
      <main className="w-screen min-h-screen overflow-hidden max-w-screen bg-neutral-700" >
        <NavigationControls/>
        <ViewContainer initialDistricts={districtList} />
      </main>
    
  );
}
