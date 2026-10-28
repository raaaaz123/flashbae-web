"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

// The project token is a public, write-only key (it ships in every page's JavaScript), so a built-in fallback is safe;
// set NEXT_PUBLIC_POSTHOG_KEY / NEXT_PUBLIC_POSTHOG_HOST in Vercel to point at another project.
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "phc_rj7GJUUm5aca9KPQyshFkCUnoR3Jb4PqSH5T2VnaP6py";
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

/** Product analytics and session replay, recorded unmasked. */
export default function PostHogProvider() {
  useEffect(() => {
    if (!KEY || posthog.__loaded) return;
    posthog.init(KEY, {
      api_host: HOST,
      person_profiles: "identified_only",
      capture_pageview: "history_change",
      capture_pageleave: true,
      // Replays record everything as-is: no input masking and no blocked elements.
      session_recording: { maskAllInputs: false, maskTextSelector: undefined, blockSelector: undefined },
    });
  }, []);
  return null;
}
