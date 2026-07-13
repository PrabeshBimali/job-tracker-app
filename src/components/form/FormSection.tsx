import type { ReactNode } from "react";

interface FormSectionProps {
  header: string;
  children: ReactNode
}

export default function FormSection({header, children}: FormSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-text-color/70">
        {header}
      </h3>
      {children}
    </section>
  )
}