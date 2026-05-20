function SearchBar({ search, setSearch }) {
  return (
    <div className="relative w-full group">
      {/* Search icon */}
      <div
        className="
        absolute left-4 top-1/2 -translate-y-1/2
        text-zinc-500 group-focus-within:text-violet-400
        transition-colors duration-150 pointer-events-none
      "
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle
            cx="6.5"
            cy="6.5"
            r="5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M10.5 10.5l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <input
        type="text"
        placeholder="Search notes…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          bg-zinc-900
          border border-white/[0.07]
          hover:border-white/[0.12]
          focus:border-violet-500/50
          focus:ring-2 focus:ring-violet-500/20
          text-white text-[14px] placeholder-zinc-600
          rounded-xl
          pl-11 pr-10 py-3
          outline-none
          transition-all duration-150
        "
      />

      {/* Clear button */}
      {search && (
        <button
          onClick={() => setSearch("")}
          className="
            absolute right-3.5 top-1/2 -translate-y-1/2
            w-5 h-5 rounded-full
            bg-zinc-700 hover:bg-zinc-600
            flex items-center justify-center
            transition-colors duration-150
          "
          aria-label="Clear search"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path
              d="M1 1l6 6M7 1L1 7"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
