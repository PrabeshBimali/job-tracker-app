interface ApplicationDetailProps { 
  label: string; 
  children: React.ReactNode; 
}

export default function ApplicationDetail({ label, children, }: ApplicationDetailProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-text-color/80">
        {label}
      </p>

      <div className="mt-1">
        {children}
      </div>
    </div>
  );
}