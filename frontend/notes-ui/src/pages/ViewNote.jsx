import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";

function ViewNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/notes/${id}`);
      setNote(data);
    } catch (err) {
      setError("Failed to load note.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const wordCount =
    note?.content?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  const readMins = Math.max(1, Math.ceil(wordCount / 200));

  if (loading) return <Loader />;

  // ── Full-page error ──
  if (error)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20
          flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="9"
                stroke="#f87171"
                strokeWidth="1.4"
              />
              <path
                d="M10 6v5M10 13.5h.01"
                stroke="#f87171"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-[14px] text-red-400 font-medium">{error}</p>
          <Link
            to="/"
            className="
          text-[13px] text-zinc-500 hover:text-zinc-300 no-underline
          transition-colors duration-150
        "
          >
            ← Back to notes
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* ── Back ── */}
        <Link
          to="/"
          className="
            inline-flex items-center gap-1.5 no-underline
            text-[13px] text-zinc-500 hover:text-zinc-300
            transition-colors duration-150 mb-8 group
          "
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="group-hover:-translate-x-0.5 transition-transform duration-150"
          >
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to notes
        </Link>

        {/* ── Title row ── */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex-1 min-w-0">
            {/* Eyebrow badge */}
            <span
              className="
              inline-flex items-center gap-1.5 mb-3
              text-[11px] font-semibold tracking-widest uppercase
              text-violet-400 bg-violet-500/10
              border border-violet-500/20
              px-2.5 py-1 rounded-full
            "
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1 2.5h8M1 5h5M1 7.5h6.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Note
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug break-words">
              {note.title}
            </h1>

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span
                className="
                inline-flex items-center gap-1.5
                text-[11px] text-zinc-500
                bg-zinc-900 border border-white/[0.06]
                px-2.5 py-1 rounded-full
              "
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle
                    cx="5"
                    cy="5"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M5 3v2.5l1.5 1"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                </svg>
                {readMins} min read
              </span>
              <span
                className="
                inline-flex items-center gap-1.5
                text-[11px] text-zinc-500
                bg-zinc-900 border border-white/[0.06]
                px-2.5 py-1 rounded-full
              "
              >
                {wordCount} words
              </span>
            </div>
          </div>

          {/* Edit button */}
          <Link
            to={`/edit/${note._id}`}
            className="
              shrink-0 inline-flex items-center gap-1.5 no-underline
              text-[13px] font-semibold text-white
              bg-gradient-to-r from-violet-600 to-indigo-600
              hover:from-violet-500 hover:to-indigo-500
              px-4 py-2.5 rounded-xl
              shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
              transition-all duration-150 active:scale-95
            "
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1.5 10.5l5.5-5.5 2 2-5.5 5.5H1.5v-2z"
                stroke="white"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 1.5l2 2"
                stroke="white"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            Edit
          </Link>
        </div>

        {/* ── Content Card ── */}
        <div
          className="
          bg-zinc-900/60 border border-white/[0.07]
          rounded-2xl overflow-hidden shadow-2xl shadow-black/30
        "
        >
          {/* Card header */}
          <div
            className="
            px-6 py-3.5 border-b border-white/[0.06]
            flex items-center justify-between
            bg-zinc-900/40
          "
          >
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
              Content
            </span>

            {/* Copy button */}
            <button
              onClick={copyContent}
              className="
                inline-flex items-center gap-1.5
                text-[11px] font-medium
                text-zinc-500 hover:text-zinc-300
                px-2.5 py-1.5 rounded-lg hover:bg-white/[0.05]
                transition-all duration-150
              "
            >
              {copied ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path
                      d="M1.5 5.5l3 3 5-5"
                      stroke="#34d399"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <rect
                      x="1"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.2"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M3.5 3V2A1 1 0 014.5 1h4a1 1 0 011 1v4a1 1 0 01-1 1H8"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <p
              className="
              text-zinc-300 text-[14px] leading-8
              whitespace-pre-wrap break-words
            "
            >
              {note.content}
            </p>
          </div>

          {/* Footer — dates */}
          <div
            className="
            px-6 py-4 border-t border-white/[0.06]
            bg-zinc-900/40
            grid grid-cols-1 sm:grid-cols-2 gap-3
          "
          >
            <div className="flex items-center gap-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="shrink-0 text-zinc-600"
              >
                <circle
                  cx="6"
                  cy="6"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M6 3.5V6.5l2 1.5"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
              <div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">
                  Created
                </p>
                <p className="text-[12px] text-zinc-400 mt-0.5">
                  {new Date(note.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="shrink-0 text-zinc-600"
              >
                <path
                  d="M1.5 9.5l4-4 2 2 3.5-5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">
                  Last updated
                </p>
                <p className="text-[12px] text-zinc-400 mt-0.5">
                  {new Date(note.updatedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewNote;
