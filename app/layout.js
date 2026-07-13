// ============================================================
// app/layout.js — the outer shell of EVERY page
// ------------------------------------------------------------
// In Next.js (App Router), layout.js wraps all pages.
// The nav bar below appears on every page automatically —
// add it once here, and every page gets it.
// ============================================================

import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "My Economy",
  description: "A personal economics dashboard — learn by building",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <Link> is Next.js's version of <a href> — it switches
            pages instantly without a full browser reload. */}
        <nav className="nav">
          <Link href="/">Ledger</Link>
          <Link href="/classes">Classes</Link>
          <Link href="/activities">Activities</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
