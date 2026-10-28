/**
 * Client library for Flashbae AI image generation and backend communication.
 * Communicates directly with the Flashbae API at https://vocavoy.dietly.life/flashbie
 */

export const API_BASE = (process.env.NEXT_PUBLIC_FLASHBAE_API || "https://vocavoy.dietly.life/flashbie").replace(/\/$/, "");

export type UserMe = {
  credits: number;
  daily_credits: number;
  bought_credits: number;
  daily_allowance: number;
  plan: string | null;
  plan_expires_ms: number | null;
  made: number;
  signed_in?: boolean;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
};

export type GeneratedPhoto = {
  id: string;
  look_id: string;
  look_title: string;
  url: string;
  width?: number;
  height?: number;
  created_at: number;
};

export type GenerateResponse = {
  photo: GeneratedPhoto;
  me: UserMe;
};

const STORAGE_KEYS = {
  deviceId: "flashbae_web_device_id",
  token: "flashbae_web_token",
  uid: "flashbae_web_uid",
  me: "flashbae_web_me",
  signedIn: "flashbae_signed_in",
};

/** Fired on window whenever the account changes (sign-in, credits spent), so the
 *  header and the generator always show the same thing. `detail` is the new profile. */
export const ACCOUNT_EVENT = "flashbae:account";

function announce(me: UserMe | null) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(ACCOUNT_EVENT, { detail: me }));
}

/** Get or create a persistent web device ID. */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "web-ssr-preview";
  let id = localStorage.getItem(STORAGE_KEYS.deviceId);
  if (!id) {
    id = "web-" + (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    localStorage.setItem(STORAGE_KEYS.deviceId, id);
  }
  return id;
}

/** Get cached token from localStorage if present. */
export function getCachedToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.token);
}

/** Get cached profile from localStorage if present. */
export function getCachedProfile(): UserMe | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.me);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Register or login this web device to obtain a JWT token and user profile.
 */
export async function ensureAuth(force = false): Promise<{ token: string; uid: string; me: UserMe }> {
  const cachedToken = getCachedToken();
  const cachedMe = getCachedProfile();
  const cachedUid = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.uid) : null;

  if (!force && cachedToken && cachedMe && cachedUid) {
    return { token: cachedToken, uid: cachedUid, me: cachedMe };
  }

  const deviceId = getDeviceId();
  const res = await fetch(`${API_BASE}/auth/device`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ device_id: deviceId, platform: "web" }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Device registration failed (${res.status}): ${errorBody}`);
  }

  const data = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.token, data.token);
    localStorage.setItem(STORAGE_KEYS.uid, data.uid);
    localStorage.setItem(STORAGE_KEYS.me, JSON.stringify(data.me));
    announce(data.me);
  }
  return { token: data.token, uid: data.uid, me: data.me };
}

/**
 * Refresh current user profile and credit count.
 */
export async function fetchMe(): Promise<UserMe> {
  const { token } = await ensureAuth();
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    // Token expired or invalid, register again
    const refreshed = await ensureAuth(true);
    return refreshed.me;
  }

  if (!res.ok) {
    throw new Error(`Failed to load user profile: ${res.statusText}`);
  }

  const me: UserMe = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.me, JSON.stringify(me));
    announce(me);
    if (me.signed_in) {
      localStorage.setItem(STORAGE_KEYS.signedIn, "true");
    }
  }
  return me;
}

/**
 * Sign in with the ID token Google Identity Services hands back. New accounts get
 * a few free credits, once; the server verifies the token with Google.
 */
export async function loginWithGoogle(idToken: string): Promise<UserMe> {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!res.ok) {
    let errorDetail = "";
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errJson.message || "";
    } catch {
      errorDetail = await res.text();
    }
    throw new Error(errorDetail || `Google sign in failed (${res.status})`);
  }

  const data = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.token, data.token);
    localStorage.setItem(STORAGE_KEYS.uid, data.uid);
    localStorage.setItem(STORAGE_KEYS.me, JSON.stringify(data.me));
    announce(data.me);
    localStorage.setItem(STORAGE_KEYS.signedIn, "true");
  }
  return data.me;
}

/** Check if current visitor has signed in with Google. */
export function isUserSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  const cachedMe = getCachedProfile();
  return Boolean(cachedMe?.signed_in || localStorage.getItem(STORAGE_KEYS.signedIn) === "true");
}

/** Sign out from Google session. */
export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.uid);
    localStorage.removeItem(STORAGE_KEYS.me);
    localStorage.removeItem(STORAGE_KEYS.signedIn);
  }
}

export type GenerateOptions = {
  lookId: string;
  photo: File | Blob;
  photo2?: File | Blob | null;
  photo3?: File | Blob | null;
};

/**
 * Generate an AI photo using the Flashbae backend.
 */
export async function generateLookPhoto(options: GenerateOptions): Promise<GenerateResponse> {
  let { token } = await ensureAuth();

  const formData = new FormData();
  formData.append("look_id", options.lookId);
  formData.append("photo", options.photo, "photo.jpg");

  if (options.photo2) {
    formData.append("photo2", options.photo2, "photo2.jpg");
  }
  if (options.photo3) {
    formData.append("photo3", options.photo3, "photo3.jpg");
  }

  let res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  // If unauthorized, re-authenticate and retry once
  if (res.status === 401) {
    const auth = await ensureAuth(true);
    token = auth.token;
    res = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  }

  if (!res.ok) {
    let detail = "";
    try {
      const errJson = await res.json();
      detail = errJson.detail || errJson.message || "";
    } catch {
      detail = await res.text();
    }

    if (res.status === 402 || detail === "no_credits" || detail === "no_plan") {
      throw new Error("no_credits");
    }
    if (detail === "could_not_render" || res.status === 422) {
      throw new Error("could_not_render");
    }
    if (res.status === 413 || detail === "image_too_large") {
      throw new Error("image_too_large");
    }
    if (res.status === 503 || detail === "ai_unavailable") {
      throw new Error("ai_unavailable");
    }
    throw new Error(detail || `Generation failed (${res.status})`);
  }

  const result: GenerateResponse = await res.json();
  if (typeof window !== "undefined" && result.me) {
    localStorage.setItem(STORAGE_KEYS.me, JSON.stringify(result.me));
    announce(result.me);
  }
  return result;
}

/**
 * The signed-in account's generated photos, newest first (60 per page, the same list
 * the app shows). Pass the oldest `created_at` you have to get the next page.
 */
export async function listPhotos(before?: number): Promise<GeneratedPhoto[]> {
  const token = getCachedToken();
  if (!token) return [];
  const qs = before ? `?before=${before}` : "";
  const res = await fetch(`${API_BASE}/photos${qs}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Couldn't load your photos (${res.status})`);
  const data: { photos: GeneratedPhoto[] } = await res.json();
  return data.photos;
}

/**
 * Trigger browser file download for a generated image directly on the page without opening a new tab.
 */
export async function downloadPhotoFile(url: string, filename = "flashbae-photo.jpg"): Promise<void> {
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const proxyUrl = `${API_BASE}/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(safeFilename)}`;

  // 1. Fetch through backend download proxy (returns CORS + Content-Disposition: attachment)
  try {
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = objectUrl;
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      }, 2000);
      return;
    }
  } catch (err) {
    console.warn("Proxy blob fetch failed, trying direct blob or iframe fallback", err);
  }

  // 2. Direct CORS blob fetch if remote origin allows it
  try {
    const res = await fetch(url, { mode: "cors" });
    if (res.ok) {
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = objectUrl;
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      }, 2000);
      return;
    }
  } catch {}

  // 3. In-page trigger via hidden iframe pointing to proxy attachment (never target="_blank")
  try {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = proxyUrl;
    document.body.appendChild(iframe);
    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch {}
    }, 6000);
    return;
  } catch (err) {
    console.warn("Iframe trigger failed", err);
  }

  // 4. In-page anchor click pointing to attachment proxy
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = proxyUrl;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => document.body.removeChild(link), 2000);
}
