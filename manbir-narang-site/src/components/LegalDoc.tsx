import type { ReactNode } from "react";
import { PageHead } from "@/components/ui";

export const LEGAL_UPDATED = "October 28, 2026";

/** Shared layout for the Privacy Policy and Terms of Use pages. */
export default function LegalDoc({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <>
      <PageHead title={title} sub={sub} />
      <section className="iv">
        <div className="w legaldoc">
          <p className="lupd">Last updated {LEGAL_UPDATED}</p>
          {children}
        </div>
      </section>
    </>
  );
}
