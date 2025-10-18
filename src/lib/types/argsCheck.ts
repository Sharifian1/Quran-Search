import surahs from "@/lib/data/surahs.json";

function normalize(str: string): string {
  return str.toLowerCase().replace(/-/g, " ").trim();
}

export function validateArgs(command: string, args: string[]): string | number | null {
  if (command === "/surah") {
    const searchTerm = normalize(args.join(" "));
    const found = surahs.find(
      s => normalize(s.name_simple) === searchTerm || normalize(s.name_arabic) === searchTerm
    );

    if (!found) return `Invalid surah name: "${searchTerm}". Please provide a valid surah.`;
    return found.id;
  }

  if (command === "/ayah") {
    if (args.length === 0) {
      return "Please provide surah number and verse number (e.g., 2:255 or 2 255).";
    }

    let surahNum: number;
    let verseNum: number;

    if (args.length === 1 && args[0].includes(":")) {
      [surahNum, verseNum] = args[0].split(":").map(Number);
    } else if (args.length >= 2) {
      surahNum = Number(args[0]);
      verseNum = Number(args[1]);
    } else {
      return "Invalid ayah format. Use either 2:255 or 2 255.";
    }

    if (Number.isNaN(surahNum) || Number.isNaN(verseNum)) {
      return "Invalid ayah format. Use surah:ayah (e.g., 2:255).";
    }

    const surah = surahs.find((s) => s.id === surahNum);
    if (!surah) {
      return `Surah number ${surahNum} does not exist.`;
    }

    if (verseNum < 1 || verseNum > surah.verses_count) {
      return `Surah ${surahNum} has ${surah.verses_count} verses, but you requested verse ${verseNum}.`;
    }

    return `${surahNum}:${verseNum}`;
  }

  return null;
}
