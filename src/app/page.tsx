//import Image from "next/image";
import QuranSearch from "@/components/QuranSearch"
import SurahList from "@/components/SurahList"

export default function Home() {
  return (
    <div className="font-sans grid min-h-full p-20">
      <main className="grid grid-cols-1 content-center gap-10">

        <QuranSearch />
        
        <div className="section-title">
          <h2>List of Surahs</h2>
        </div>
        <p>If you are a new revert and your are not familiar with the content of the quran, click here to get the first 40 chapters of the quran.</p>
        
        <SurahList />
      </main>
    </div>
  );
}
