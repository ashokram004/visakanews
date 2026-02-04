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

export async function updateFromStrapi(
  path: string,
  data: any,
  options: RequestInit = {}
) {
  const url = `${STRAPI_URL}${path}`;

  const res = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Failed to update ${path}: ${res.status} ${res.statusText}`, errorText);
    throw new Error(`Failed to update ${path}: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
