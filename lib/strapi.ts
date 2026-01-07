const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL + "/api";

if (!STRAPI_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function fetchFromStrapi(
  path: string,
  options: RequestInit = {}
) {
  const url = `${STRAPI_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }

  return res.json();
}
