interface PaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination( { page, totalPages, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-secondary-color pt-5 md:flex-row md:items-center md:justify-between text-text-color">

      <div className="flex items-center gap-3">
        <span className="text-sm text-text-color">
          Show
        </span>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-secondary-color bg-background-color px-3 py-2 text-sm outline-none transition-colors focus:border-button-color"
        >
          {[10, 25, 50, 100].map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <span className="text-sm text-text-color">
          entries
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center border border-secondary-color transition-colors hover:border-button-color disabled:cursor-not-allowed disabled:opacity-40"
        >
          ‹
        </button>

        {start > 1 && (
          <>
            <PageButton
              number={1}
              active={page === 1}
              onClick={onPageChange}
            />
            {start > 2 && (
              <span className="px-1 text-secondary-color">...</span>
            )}
          </>
        )}

        {pages.map(number => (
          <PageButton
            key={number}
            number={number}
            active={page === number}
            onClick={onPageChange}
          />
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="px-1 text-secondary-color">...</span>
            )}

            <PageButton
              number={totalPages}
              active={page === totalPages}
              onClick={() => {
                console.log(page)
                return onPageChange
              }}
            />
          </>
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center border border-secondary-color transition-colors hover:border-button-color disabled:cursor-not-allowed disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  );
}

interface PageButtonProps {
  number: number;
  active: boolean;
  onClick: (page: number) => void;
}

function PageButton({
  number,
  active,
  onClick,
}: PageButtonProps) {
  return (
    <button
      onClick={() => onClick(number)}
      className={`flex h-9 w-9 cursor-pointer items-center justify-center border text-sm transition-colors ${ active ? "border-button-color bg-button-color text-background-color" : "border-secondary-color hover:border-button-color"}`}
    >
      {number}
    </button>
  );
}