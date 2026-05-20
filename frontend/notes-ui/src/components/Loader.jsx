// Loader.jsx
function Loader() {
  return (
    <div
      className="
      fixed inset-0 z-50
      bg-zinc-950
      flex flex-col items-center justify-center
      gap-8
    "
    >
      {/* Animated logo mark */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div
          className="
          absolute w-16 h-16 rounded-full
          border-2 border-transparent
          border-t-violet-500 border-r-violet-500/30
          animate-spin
        "
          style={{ animationDuration: "1s" }}
        />

        {/* Middle counter-spin ring */}
        <div
          className="
          absolute w-11 h-11 rounded-full
          border-2 border-transparent
          border-b-indigo-400 border-l-indigo-400/30
          animate-spin
        "
          style={{ animationDuration: "0.75s", animationDirection: "reverse" }}
        />

        {/* Center icon */}
        <div
          className="
          w-7 h-7 rounded-lg
          bg-gradient-to-br from-violet-500 to-indigo-600
          shadow-lg shadow-violet-500/40
          flex items-center justify-center
        "
        >
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
            <path
              d="M2 2.5h11M2 5.5h7M2 8.5h9M2 11.5h5"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Animated dots + label */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-[13px] font-medium text-zinc-500 tracking-widest uppercase">
          NoteSpace
        </p>

        {/* Three bouncing dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.9s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loader;
