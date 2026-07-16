const statuses = [
  "All",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

export default function StatusFilter() {
  return (
    <div className="flex flex-wrap gap-2">

      {statuses.map(status => (
        <button
          key={status}
          className="cursor-pointer border border-secondary-color bg-background-color px-3 py-2 text-sm transition-colors hover:border-button-color"
        >
          {status}
        </button>
      ))}

    </div>
  );
}