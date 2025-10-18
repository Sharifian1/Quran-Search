import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("https://apis-prelive.quran.foundation/content/api/v4/chapters",
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

        const chapters = await res.json();
        return NextResponse.json({ chapters }, { status: 200 })

    } catch (error) {
        console.error("Error fetching data", error)
        return NextResponse.json({error:"failed to fetch chapters"}, {status:500})
    }
}