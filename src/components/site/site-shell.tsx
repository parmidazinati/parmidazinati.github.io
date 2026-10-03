"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Site } from "./site";
import { Preloader } from "./preloader";
import { AdminPanel } from "@/components/admin/admin-panel";
import type { SiteContent } from "@/lib/site-content";

/**
 * Client-side switcher between the public site and the admin panel.
 *
 * The admin view lives on the same `/` route (no extra route needed):
 *  - opened via the discreet "مدیریت سایت" tab fixed to the right edge, or
 *  - via the `?admin=1` URL parameter (passed from the server as initialAdmin).
 *
 * Saved content is pushed straight into local state (onSaved), so returning
 * to the public site shows the changes immediately without relying on
 * router caching. Fresh visitors always get the latest DB content because
 * the page renders dynamically on the server.
 *
 * The intro preloader (terminal-style boot screen) plays once per page
 * load for the public site; admin mode and every return-visit inside the
 * same session skip it.
 */
export function SiteShell({
  content,
  initialAdmin = false,
}: {
  content: SiteContent;
  initialAdmin?: boolean;
}) {
  const [currentContent, setCurrentContent] = useState(content);
  const [adminMode, setAdminMode] = useState(initialAdmin);
  const [booted, setBooted] = useState(initialAdmin);

  const openAdmin = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("admin", "1");
    window.history.replaceState(null, "", url);
    setAdminMode(true);
    window.scrollTo({ top: 0 });
  }, []);

  const handleSaved = useCallback((saved: SiteContent) => {
    setCurrentContent(saved);
  }, []);

  const exitAdmin = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("admin");
    window.history.replaceState(null, "", url);
    setAdminMode(false);
  }, []);

  if (adminMode) {
    return (
      <AdminPanel
        initialContent={currentContent}
        onSaved={handleSaved}
        onExit={exitAdmin}
      />
    );
  }

  return (
    <>
      <Site content={currentContent} booted={booted} onOpenAdmin={openAdmin} />
      <AnimatePresence>
        {!booted && (
          <Preloader key="preloader" onDone={() => setBooted(true)} />
        )}
      </AnimatePresence>
    </>
  );
}
