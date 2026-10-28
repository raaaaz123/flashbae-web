"use client";

import { useEffect, useRef, useState } from "react";

/** The website's OAuth Web client id (Google Cloud → APIs & Services → Credentials). */
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

type Gsi = {
  accounts: {
    id: {
      initialize: (cfg: Record<string, unknown>) => void;
      renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
    };
  };
};
declare global {
  interface Window { google?: Gsi }
}

let loading: Promise<Gsi> | null = null;
/** Google Identity Services, loaded once per page. */
function loadGsi(): Promise<Gsi> {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => (window.google ? resolve(window.google) : reject(new Error("Google sign-in failed to load")));
    s.onerror = () => {
      loading = null;
      reject(new Error("Couldn't reach Google. Check your connection and try again."));
    };
    document.head.appendChild(s);
  });
  return loading;
}

/** Google's own "Continue with Google" button. Hands the ID token to `onCredential`. */
export default function GoogleSignIn({ onCredential, width = 320 }: { onCredential: (idToken: string) => void; width?: number }) {
  const box = useRef<HTMLDivElement>(null);
  // The latest callback, so re-renders don't re-initialise Google's button.
  const cb = useRef(onCredential);
  cb.current = onCredential;
  const [error, setError] = useState<string | null>(GOOGLE_CLIENT_ID ? null : "Google sign-in isn't set up yet (NEXT_PUBLIC_GOOGLE_CLIENT_ID).");

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let live = true;
    loadGsi()
      .then((g) => {
        if (!live || !box.current) return;
        g.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (res: { credential?: string }) => res.credential && cb.current(res.credential),
          ux_mode: "popup",
          use_fedcm_for_button: true,
        });
        g.accounts.id.renderButton(box.current, {
          type: "standard", theme: "outline", size: "large", shape: "pill",
          text: "continue_with", logo_alignment: "left", width,
        });
      })
      .catch((e: Error) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, [width]);

  return (
    <div className="gsi">
      <div ref={box} className="gsi-button" />
      {error && <p className="gsi-error" role="alert">{error}</p>}
    </div>
  );
}
