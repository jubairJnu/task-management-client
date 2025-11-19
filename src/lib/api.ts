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
// export async function getProductSlugs(): Promise<string[]> {
//   try {
//     const products = await getAllProducts();
//     return products.map((product) => product.slug);
//   } catch (error) {
//     console.error("Error fetching product slugs:", error);
//     return [];
//   }
// }
