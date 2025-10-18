//import Image from "next/image";
import QuranSearch from "@/components/QuranSearch"
import SurahList from "@/components/SurahList"

export default function Home() {
  return (
    <div className="font-sans grid w-full h-full p-50">
      <main className="grid grid-cols-1 content-center gap-8">
        <QuranSearch />
        
        <h2>List of Surahs</h2>
        <p>If you are a new revert and your are not familiar with the content of the quran, click here to get the first 40 chapters of the quran.</p>
        
        <SurahList />
      </main>
      
    </div>
  );
}
