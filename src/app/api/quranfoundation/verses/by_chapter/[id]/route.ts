import { NextRequest, NextResponse } from "next/server";
import { Verse } from "@/lib/types/quran";

async function getAccessToken() {
  const clientId = process.env.QF_CLIENT_ID;
  const clientSecret = process.env.QF_CLIENT_SECRET;
  const scope = "content"; // adjust based on your requested scope

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://oauth2.quran.foundation/oauth2/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: scope,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get access token: ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const awaitedParams = await context.params;
    const { id } = await awaitedParams;
    const env = process.env.QF_ENV || "prelive";

    let baseUrl = "";
    let headers: Record<string, string> = {};
    let token = "";

    if (env === "production") {
      baseUrl = "https://oauth2.quran.foundation/content/api/v4";
      token = await getAccessToken();
      headers = {
        "Authorization": `Bearer ${token}`,
        "x-auth-token": token,        //some APIs expect the token inside x-auth-token also
        "x-client-id": process.env.QF_CLIENT_ID || "",
      };
    } else {
      baseUrl = "https://apis-prelive.quran.foundation/content/api/v4";
      headers = {
        "x-auth-token": process.env.X_AUTH_TOKEN || "",
        "x-client-id": process.env.X_CLIENT_ID || "",
      };
    }

    const res = await fetch(`${baseUrl}/verses/by_chapter/${id}`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch verses for chapter ${id}: ${errorText}`);
    }
    
    const data = await res.json();
    const verses: Verse[] = data.verses ?? data;
    
    return NextResponse.json( verses );
  } catch (error) {
    console.error(`Failed to fetch chapter verses:`, error);
    return NextResponse.json(
      { error: "Failed to fetch chapter verses" },
      { status: 500 }
    );
  }
}
