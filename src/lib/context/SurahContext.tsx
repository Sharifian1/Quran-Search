"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Chapter, ChapterInfo } from "@/lib/types/quran";

interface SurahContextType {
  chapters: Chapter[];
  chapterInfos: Record<number, ChapterInfo>;
  setChapters: (chapters: Chapter[]) => void;
  setChapterInfos: (infos: Record<number, ChapterInfo>) => void;
}

const SurahContext = createContext<SurahContextType | undefined>(undefined);

export const SurahProvider = ({ children }: { children: ReactNode }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterInfos, setChapterInfos] = useState<Record<number, ChapterInfo>>({});

  return (
    <SurahContext.Provider value={{ chapters, chapterInfos, setChapters, setChapterInfos }}>
      {children}
    </SurahContext.Provider>
  );
};

export const useSurahContext = () => {
  const context = useContext(SurahContext);
  if (!context) throw new Error("useSurahContext must be used within a SurahProvider");
  return context;
};
