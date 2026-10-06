"use client";

import { useState } from "react";
import type { Layout, LayoutId } from "@/lib/booth";
import { LAYOUTS } from "@/lib/booth";

/** A little drawing of the layout: the frames as blocks on a strip. */
function Mini({ layout }: { layout: Layout }) {
  const rows = layout.count / layout.columns;
  return (
    <span className={`mini mini-${layout.columns}`} aria-hidden="true" style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}>
      {Array.from({ length: layout.count }, (_, i) => <span key={i} />)}
    </span>
  );
}

/** Classic, 4-cut and Trio are free on the web; 6-cut is shown, and points to the app. */
export default function LayoutPicker({ value, onChange }: { value: LayoutId; onChange: (l: Layout) => void }) {
  const [pro, setPro] = useState(false);
  return (
    <fieldset className="field">
      <legend>Layout</legend>
      <div className="layouts" role="radiogroup" aria-label="Layout">
        {LAYOUTS.map((l) => (
          <button key={l.id} type="button" role="radio" aria-checked={l.id === value} className={`layout-opt${l.pro ? " layout-pro" : ""}`}
                  aria-label={l.pro ? `${l.title}, in the app` : `${l.title}, ${l.count} frames`}
                  onClick={() => (l.pro ? setPro(true) : (setPro(false), onChange(l)))}>
            <Mini layout={l} />
            <span>{l.title}</span>
            {l.pro && <span className="tag">App</span>}
          </button>
        ))}
      </div>
      {pro && <p className="field-note" role="status">The 6-cut layout is in the Flashbae app, along with stickers and every frame colour.</p>}
    </fieldset>
  );
}
