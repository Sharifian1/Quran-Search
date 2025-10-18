export interface Chapter {
    id: number;
    revelation_place: string;
    revelation_order: number;
    bismillah_pre: boolean;
    name_simple: string;
    name_complex: string;
    name_arabic: string;
    verses_count: number;
    pages: number[];
    translated_name: TranslatedName;
}

export interface ChapterApiResponse {
  id: string;
  result: {
    type: "surah";
    query: string;
    info: ChapterInfoResult | null;
    chapter: Chapter | null;
  };
}

export interface TranslatedName {
  language_name: string;
  name: string;
}

export interface ChapterInfo extends Chapter {
  id: number;
  short_text: string;
  source: string;
  text: string;
}

export interface Verse {
  id: number;
  chapter_id: number;
  verse_key: string;
  verse_number: number;
  text_uthmani: string;
  text_indopak?: string;
}

export type ChapterInfoResult = {
  type: "surah";
  query: string;
  result: ChapterInfo | null;
}

export type AyahResult = {
  type: "ayah";
  query: string;
  result: Verse | null;
}


export type SearchResult = ChapterInfoResult | AyahResult;