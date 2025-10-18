export type Command = "/surah" | "/ayah";

export const commandMap: Record<Command, (searchTerm: string | number) => string> = {
    "/surah": (term) => `/api/quranfoundation/chapters/${encodeURIComponent(term)}/info`,
    "/ayah": (term) => `/api/quranfoundation/verses/by_key/${encodeURIComponent(term)}`,}