/**
 * JWT helpers for calling the backend API (http://localhost:8000).
 *
 * The better-auth server on this app (the `jwt()` plugin in src/lib/auth.ts)
 * issues a JWT for the signed-in user at POST /api/auth/token — it only
 * succeeds while the session cookie is present. Authorized requests to the
 * backend send that token as "Authorization: Bearer <token>"; the backend
 * verifies its signature against this app's JWKS (GET /api/auth/jwks).
 */

type TokenResponse = {
  token?: string;
};

const getJwtToken = async (): Promise<string | null> => {
  try {
    const res = await fetch("/api/auth/token", { method: "GET" });

    if (!res.ok) {
      return null;
    }

    const data: TokenResponse = await res.json();

    return typeof data.token === "string" ? data.token : null;
  } catch {
    return null;
  }
};

/**
 * Same as `fetch`, but attaches the JWT of the signed-in user.
 * Throws when the user has no valid session, so protected API calls
 * fail fast with a clear message instead of a backend 401.
 */
export const authorizedFetch = async (
  url: string,
  init: RequestInit = {}
): Promise<Response> => {
  const token = await getJwtToken();

  if (!token) {
    throw new Error("You must be signed in to perform this action.");
  }

  return fetch(url, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
