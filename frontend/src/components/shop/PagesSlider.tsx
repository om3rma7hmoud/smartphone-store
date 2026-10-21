interface PagesSliderProps {
  pageCount: number;
  current: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

function PagesSlider({ pageCount, current, setPage }: PagesSliderProps) {
  return (
    <>
      {pageCount > 1 && (
        <nav
          className="mt-10 flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          <button
            type="button"
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
            className="border-line text-ink ease-premium hover:border-ink disabled:text-ink-300 disabled:hover:border-line h-10 border px-4 text-[13.5px] font-medium transition-colors duration-150 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              aria-current={current === i + 1 ? "page" : undefined}
              className={`ease-premium h-10 w-10 border text-[13.5px] font-medium transition-colors duration-150 ${
                current === i + 1
                  ? "border-ink bg-ink text-white"
                  : "border-line text-ink hover:border-ink"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            disabled={current === pageCount}
            onClick={() => setPage(current + 1)}
            className="border-line text-ink ease-premium hover:border-ink disabled:text-ink-300 disabled:hover:border-line h-10 border px-4 text-[13.5px] font-medium transition-colors duration-150 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      )}
    </>
  );
}

export default PagesSlider;
