// EmptyState.jsx
import { Link } from "react-router-dom";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 px-6">
      {/* Illustrated icon */}
      <div className="relative mb-8">
        {/* Glow backdrop */}
        <div
          className="
          absolute inset-0 rounded-2xl
          bg-violet-500/10 blur-2xl scale-150
        "
        />

        {/* Icon box */}
        <div
          className="
          relative w-20 h-20 rounded-2xl
          bg-zinc-900 border border-white/[0.07]
          shadow-xl shadow-black/40
          flex items-center justify-center
        "
        >
          {/* Decorative lines mimicking a blank note */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect
              x="6"
              y="4"
              width="24"
              height="28"
              rx="3"
              stroke="#52525b"
              strokeWidth="1.5"
            />
            <path
              d="M11 11h14M11 16h10M11 21h12M11 26h7"
              stroke="#52525b"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Small sparkle top-right */}
            <path
              d="M27 5l.6 1.4L29 7l-1.4.6L27 9l-.6-1.4L25 7l1.4-.6z"
              fill="#7c3aed"
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Floating dot accents */}
        <span
          className="
          absolute -top-1 -left-1.5
          w-2 h-2 rounded-full
          bg-violet-500/50 blur-[1px]
        "
        />
        <span
          className="
          absolute -bottom-1 -right-1
          w-1.5 h-1.5 rounded-full
          bg-indigo-400/40 blur-[1px]
        "
        />
      </div>

      {/* Text */}
      <h2 className="text-[18px] font-semibold text-white/90 mb-2 tracking-tight">
        No notes yet
      </h2>
      <p className="text-[13px] text-zinc-500 text-center max-w-[220px] leading-relaxed mb-8">
        Capture your thoughts — your first note is one click away.
      </p>

      {/* CTA */}
      <Link
        to="/create"
        className="
          inline-flex items-center gap-2 no-underline
          text-[13px] font-semibold text-white
          bg-gradient-to-r from-violet-600 to-indigo-600
          hover:from-violet-500 hover:to-indigo-500
          px-5 py-2.5 rounded-xl
          shadow-lg shadow-violet-500/25
          hover:shadow-violet-500/40
          transition-all duration-150 active:scale-95
        "
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M6.5 1v11M1 6.5h11"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        Create your first note
      </Link>
    </div>
  );
}

export default EmptyState;
