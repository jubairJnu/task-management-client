// lib/api.ts

"use server";

import config from "@/config";

export async function postUserSignup(
  payload: any
): Promise<{ success: boolean; data: any } | null> {
  try {
    const response = await fetch(`${config.api_url}/users`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log(result, "result");
    return result;
  } catch (error) {
    console.error("Error signing up user:", error);
    return null;
  }
}

// Optional: Function to get product slugs (for generateStaticParams)
export async function getTeamList(): Promise<any[]> {
  try {
    const response = await fetch(`${config.api_url}/teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // optional for Next.js
    });

    if (!response.ok) {
      throw new Error("Failed to fetch team list");
    }

    const data = await response.json();
    return data?.data || []; // return the real team list
  } catch (error) {
    console.error("Error fetching team list", error);
    return [];
  }
}
