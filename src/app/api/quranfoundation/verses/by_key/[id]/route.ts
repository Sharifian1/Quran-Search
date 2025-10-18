import { NextRequest, NextResponse } from "next/server";
import { AyahResult } from "@/lib/types/quran";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        const {id} = params;
        const res = await fetch(`https://apis-prelive.quran.foundation/content/api/v4/verses/by_key/${id}`,
            {
                headers: {
                    "x-auth-token": process.env.X_AUTH_TOKEN || '',
                    "x-client-id": process.env.X_CLIENT_ID || '',
                },
                cache: "no-store",
            }
        )
        if (!res.ok) {
            throw new Error(`Failed to fetch chapters`)
        }

        const data = await res.json();
        return NextResponse.json({ 
            type: "ayah",
            query: id,
            result: data.verse as AyahResult,
         }, { status: 200 })
    
        } catch (error) {
            console.error("Error fetching data", error)
            return NextResponse.json({error:"failed to fetch chapters"}, {status:500})
        }
}