"use client";
import { useEffect, useState } from "react";
import { API, built, toLooks, type ApiCatalog, type Category, type Look } from "./looks";

/** The catalog as the browser sees it right now: starts with the build's copy, then swaps in the live /looks, so a
 * look switched on in the admin shows up without a redeploy. */
export default function useLiveLooks(): { looks: Look[]; categories: Category[] } {
  const [live, setLive] = useState(built);
  useEffect(() => {
    let off = false;
    fetch(`${API}/looks`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((body: ApiCatalog) => { if (!off && body.looks?.length) setLive(toLooks(body)); })
      .catch(() => {});
    return () => { off = true; };
  }, []);
  return live;
}
