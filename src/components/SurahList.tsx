"use client";

import { useState, useEffect } from "react";
import { useSurahContext } from "@/lib/context/SurahContext";
import Link from "next/link";

export default function SurahList() {
    const { chapters, chapterInfos, setChapters, setChapterInfos } = useSurahContext();
    const [loadingChapters, setLoadingChapters] = useState(false);
    const [loadingInfoIds, setLoadingInfoIds] = useState<Set<number>>(new Set());
    const [activeChapterId, setActiveChapterId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    

    const [error, setError] = useState<string | null>(null);

    async function handleFetchChapters() {
        if (chapters.length) return;
            setLoadingChapters(true);
            setError(null);
        try {
        const res = await fetch("/api/quranfoundation/chapters");
        if (!res.ok) throw new Error("Failed to fetch chapters");
            const data = await res.json();
            setChapters(Array.isArray(data.chapters?.chapters) ? data.chapters.chapters : []);
        } catch (err) {
            console.log(err)
            setError("Failed to load chapters.");
        } finally {
            setLoadingChapters(false);
        }
    }


    async function handleFetchInfo(id: number) {
        if (chapterInfos[id]) {
            setActiveChapterId(id);
            setShowModal(true);
            return;
        }
        setLoadingInfoIds(prev => new Set(prev).add(id));
        setError(null);
        try {
        const infoRes = await fetch(`/api/quranfoundation/chapters/${id}/info`);
        if (!infoRes.ok) throw new Error("Failed to fetch chapter info");
            const data = await infoRes.json();
            setChapterInfos({
                ...chapterInfos,
                [id]: data.result   
            });
            setActiveChapterId(id);
            setShowModal(true);
        } catch (err) {
            console.log(err)
            setError("Failed to load infos.");
        } finally {
            setLoadingInfoIds(prev => {
                const copy = new Set(prev);
                copy.delete(id);
                return copy;
            });
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
        const saved = localStorage.getItem("chapterInfos");
        if (saved) setChapterInfos(JSON.parse(saved));
    }}, [setChapterInfos]);

    useEffect(() => {
        if (typeof window !== "undefined") {
        localStorage.setItem("chapterInfos", JSON.stringify(chapterInfos));
    }}, [chapterInfos]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setShowModal(false);
        }
        if (showModal) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [showModal]);

    useEffect(() => {
        const savedScroll = sessionStorage.getItem("surahScroll");
        if (savedScroll) {
            window.scrollTo(0, Number(savedScroll));
        }
    }, []);

    useEffect(() => {
        function handleScroll() {
            sessionStorage.setItem("surahScroll", window.scrollY.toString());
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    function getSuffix(order: number) {
        switch (order) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
        
            default:
                return "th";
        }
    };

    return(
        <>
        {chapters.length === 0 ?
            <button onClick={handleFetchChapters} className="rounded px-[5px] w-50 py-[10px] bg-[#009000] cursor-pointer">
                {loadingChapters ? "Loading..." : "Load Surah List"}
            </button> : null
        }
   
        {error && <p className="text-red-500">{error}</p>}

        <ol className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
            {chapters.map((ch) => (
                <li 
                    key={ch.id} 
                    className=" items-center rounded-xl p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                >
                    <p className="flex font-bold">{ch.id}</p>
                    <div className="space-y-5px">
                        <p className="text-[2rem] "> {ch.translated_name.name} </p>
                        <p className="flex gap-2"><span>{ch.name_complex}</span><span>{ch.name_arabic}</span></p>
                        <div className="flex flex-col my-[15px]">
                            <div className="flex justify-between">
                                <span className="font-semibold">Revealed in:</span>
                                <span>{ch.revelation_place}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-semibold">Order of Revelation:</span>
                                <span>{ch.revelation_order} {getSuffix(ch.revelation_order)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-semibold">Number of Verses:</span>
                                <span>{ch.verses_count}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-semibold">Number of Pages:</span>
                                <span>
                                    {ch.pages[0] === ch.pages[1]
                                        ? ch.pages[0]
                                        : ch.pages[1] - ch.pages[0] +1
                                    }
                                </span>
                            </div>
                        </div>
                        <span>
                            <button
                                onClick={() => handleFetchInfo(ch.id)}
                                disabled={loadingInfoIds.has(ch.id)}
                                className=" cursor-pointer underline"
                            >
                                Load more Infos
                            </button>
                            <Link href={`chapters/${ch.id}`} className=" ml-[50px] rounded px-[5px] py-[10px] bg-[#009000] ">Read {ch.translated_name.name} verses </Link>
                        </span>
                    </div>
                </li>
            ))}
        </ol>

        {showModal && activeChapterId && chapterInfos[activeChapterId] && (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                showModal ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setShowModal(false)}
        >
            <div
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-lg w-full relative"
            onClick={e => e.stopPropagation()}
            >
            <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
                ✕
            </button>

            <h2 className="text-xl font-semibold mb-2 text-center">
                {chapters.find(ch => ch.id === activeChapterId)?.name_complex}
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {chapterInfos[activeChapterId].text}
            </p>
            <p className="mt-4 text-xs text-right text-slate-500">
                Source: {chapterInfos[activeChapterId].source}
            </p>
            </div>
        </div>
        )}

        </>
    )
};