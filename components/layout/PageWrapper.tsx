import type { ReactNode } from "react";

/* ============================================================
   PageWrapper
   
   Constrains content to a 720px column, centered.
   Horizontal padding scales with viewport via CSS clamp(),
   defined in globals.css as .page-wrapper.
   ============================================================ */

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={["page-wrapper", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}