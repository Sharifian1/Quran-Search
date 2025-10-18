import { NextRequest, NextResponse } from "next/server";
import { ChapterInfoResult, ChapterInfo } from "@/lib/types/quran";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  const awaitedParams = await params;
  const { id } = awaitedParams;

  try {
    const res = await fetch(
      `https://apis-prelive.quran.foundation/content/api/v4/chapters/${id}/info`,
      {
        headers: {
          "x-auth-token": process.env.X_AUTH_TOKEN || "",
          "x-client-id": process.env.X_CLIENT_ID || "",
        },
      }
    );

    if (!res.ok) throw new Error(`Failed to fetch chapter info for ${id}`);
    const data = await res.json();

    return NextResponse.json({
            type: "surah",
            query: id, // or whatever the original query was
            result: data.chapter_info as ChapterInfoResult | ChapterInfo | null,
        });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch chapter info" }, { status: 500 });
  }
}
