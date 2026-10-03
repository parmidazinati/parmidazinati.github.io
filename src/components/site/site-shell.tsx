"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Site } from "./site";
import { Preloader } from "./preloader";
import type { SiteContent } from "@/lib/site-content";

/**
 * Public site shell.
 *
 * The intro preloader (terminal-style boot screen) plays once per page load;
 * hero entrance animations start only after it finishes. The admin panel is
 * NOT part of the public page anymore — it lives on its own private route.
 */
export function SiteShell({ content }: { content: SiteContent }) {
  const [booted, setBooted] = useState(false);

  return (
    <>
      <Site content={content} booted={booted} />
      <AnimatePresence>
        {!booted && (
          <Preloader key="preloader" onDone={() => setBooted(true)} />
        )}
      </AnimatePresence>
    </>
  );
}
