import { Chapter, Verse } from "@/lib/types/quran";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const [chapterRes, versesRes] = await Promise.all([
    fetch(`http://localhost:3000/api/quranfoundation/chapters/${id}`),
    fetch(`http://localhost:3000/api/quranfoundation/verses/by_chapter/${id}`)
  ]);

  if (!chapterRes.ok || !versesRes.ok ) {
    throw new Error(`Failed to fetch data. Status codes: chapterRes=${chapterRes?.status}, versesRes=${versesRes?.status}`);
  }

  const [chapter, verses]: [Chapter, Verse[]] = await Promise.all([chapterRes.json().catch(() => null),versesRes.json().catch(() => []),]);
  
  return (
    <>
    <div className="grid w-full h-full p-50">
      <div className="grid grid-cols-1 content-center gap-8">
        <h1>Surah: {chapter.name_simple} </h1>

        {verses.length > 0 ? (
          verses.map(v => <p key={v.id}>
            {v.text_uthmani ? v.text_uthmani : `Verse ${v.verse_number} (${v.verse_key})`}
          </p>)) : (
          <p>No Verses found</p>)
        }
      </div>
    </div>
    </>
  )
}
