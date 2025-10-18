import { NextRequest, NextResponse } from "next/server";
import { Chapter } from "@/lib/types/quran";

export async function GET(
  req: NextRequest, { 
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  try {
    const res = await fetch(
      `https://apis-prelive.quran.foundation/content/api/v4/chapters/${id}`,
      {
        headers: {
          "x-auth-token": process.env.X_AUTH_TOKEN || "",
          "x-client-id": process.env.X_CLIENT_ID || "",
        },
      }
    );

    if (!res.ok) throw new Error(`Failed to fetch the chapter for ${id}`);

    const data = await res.json();
    console.log("The data is:", data)

    return NextResponse.json(data.chapter as Chapter);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch the chapter" }, { status: 500 });
  }
}
