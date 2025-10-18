"use client";

import { useState } from "react";
import { validateArgs } from "@/lib/types/argsCheck"
import { commandMap, Command } from "@/lib/types/commandMap";
import { SearchResult } from "@/lib/types/quran"
import Link from "next/link";

export default function QuranSearch() {
  const [query, setQuery] = useState("");
  const commandRaw = query.trim().split(/\s+/).find((word) => word.startsWith("/")) || "";
  const isKnownCommand = !!commandRaw && Object.prototype.hasOwnProperty.call(commandMap, commandRaw);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function renderCommandStatus(commandRaw: string, isKnownCommand: boolean, submitted: boolean) {
    if (!commandRaw) {
        return <p className="text-gray-500">Type a command to start (e.g., /surah or /ayah,).</p>;
    }

    if (submitted && isKnownCommand) {
        return (
            <p>
                The command <strong className="text-green-600">{commandRaw}</strong> is valid.
            </p>
        ); 
    }

    if (submitted && !isKnownCommand && commandRaw !== "/") {
      return (
        <p>The command <strong className="text-red-600">{commandRaw}</strong> is invalid.</p>
      )
    }

    return null;
  };
  
  async function handleSearch(e: React.FormEvent) {
  e.preventDefault();
  setSubmitted(true);
  setError(null);
  setResult(null);

  const trimmed = query.trim();
  if (!trimmed.startsWith("/")) {
    setError("Please start your query with a command like /surah or /ayah");
    return;
  }

  const [commandRaw, ...args] = trimmed.split(/\s+/);
  const validation = validateArgs(commandRaw, args);

  if (validation === null) {
    setError("No arguments provided or invalid command.");
    return;
  }

  if (
    typeof validation === "string" &&
    !/^\d+:\d+$/.test(validation) &&
    isNaN(Number(validation)) &&     
    !commandRaw.includes("/keyword") 
  ) {
    setError(validation);
    return;
  }

  const urlFunc = commandMap[commandRaw as Command];
  if (!urlFunc) {
    setError(`Unknown command "${commandRaw}". Try /surah, /ayah, or /keyword.`);
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(urlFunc(validation));
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data: SearchResult = await res.json();
    setResult(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Unknown error");
  } finally {
    setLoading(false);
  }
}


  function renderResult(result: SearchResult | null, error: string | null) {
    if (error) return <p className="text-red-500">{error}</p>;
    if (!result) return <p className="text-gray-500">No results yet.</p>;

    switch (result.type) {
      case "surah":
        if (!result.result) return <p>Surah not found.</p>;
        return (
          <div className="border p-4 rounded space-y-5 prose prose-invert  outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <p>{result.result.short_text}</p>
            <p><em>Source: {result.result.source}</em></p>
            <div dangerouslySetInnerHTML={{ __html: result.result.text }} />
            <Link href={`/chapters/${result.query}`} className=" rounded px-[5px] py-[10px] bg-[#009000]">
              Read All The Verses
            </Link>
          </div>
        );

      case "ayah":
        if (!result.result) return <p>Ayah not found.</p>;
        const [surahNum, verseNum] = result.result.verse_key.split(":");
        return (
          <div className="border p-4 rounded space-y-5 prose prose-invert outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <h2>Surah {surahNum}, Ayah {verseNum}</h2>
            <p>{result.result.text_uthmani}</p>
            {result.result.text_indopak && <p>{result.result.text_indopak}</p>}
            <Link href={`/chapters/${result.query}`} className=" rounded px-[5px] py-[10px] bg-[#009000]">
              Read All The Verses {}
            </Link>
          </div>
        );

      default:
        return <pre>{JSON.stringify(result, null, 2)}</pre>;
    }
  }

    return (
        <>
        <div>
            <form onSubmit={handleSearch} className="mb-4">
                <div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            const val = e.target.value;
                            setQuery(val);
                            setSubmitted(false);
                            setError(null);
                            setResult(null);
                            }
                        }
                        placeholder='Tell me what surah or ayah do you want to read and medidate on. Try "/surah al-fatihah" or "/ayah 2:255"'
                        className="w-full p-2 border rounded"
                    />
                </div>
            </form>

            {renderCommandStatus(commandRaw, isKnownCommand, submitted)}

            {loading ? <p>Loading...</p> : renderResult(result, error)}
        </div>
        </>
    )
}