import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const TAG_COLORS = [
  "text-violet-400 bg-violet-500/10 border-violet-500/25",
  "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
  "text-sky-400    bg-sky-500/10    border-sky-500/25",
  "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  "text-amber-400  bg-amber-500/10  border-amber-500/25",
  "text-rose-400   bg-rose-500/10   border-rose-500/25",
  "text-pink-400   bg-pink-500/10   border-pink-500/25",
  "text-teal-400   bg-teal-500/10   border-teal-500/25",
];

function NoteCard({ note, fetchNotes }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pinned, setPinned] = useState(note.pinned ?? false);
  const [pinning, setPinning] = useState(false);

  // ── Delete ──
  const deleteHandler = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    try {
      setDeleting(true);
      await API.delete(`/notes/${note._id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
      setDeleting(false);
      setConfirming(false);
    }
  };

  // ── Pin toggle ──
  const pinHandler = async () => {
    try {
      setPinning(true);
      const response = await API.put(
        `/notes/${note._id}`,

        {
          title: note.title,

          content: note.content,

          tags: note.tags,

          pinned: !pinned,
        },
      );

      setPinned(response.data.pinned);

      fetchNotes();
    } catch (err) {
      console.error(err);
    } finally {
      setPinning(false);
    }
  };

  const wordCount = note.content.trim().split(/\s+/).filter(Boolean).length;
  const readMins = Math.max(1, Math.ceil(wordCount / 200));

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const tags = note.tags ?? [];

  return (
    <div
      className={`
        group relative flex flex-col
        bg-zinc-900/70 hover:bg-zinc-900
        border hover:border-white/[0.11]
        ${pinned ? "border-violet-500/30" : "border-white/[0.06]"}
        rounded-2xl overflow-hidden
        shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30
        transition-all duration-200
      `}
      onMouseLeave={() => setConfirming(false)}
    >
      {/* Top accent line — amber when pinned */}
      <div
        className={`
        h-px w-full bg-gradient-to-r
        ${
          pinned
            ? "from-amber-400/60 via-amber-500/20 to-transparent"
            : "from-violet-500/40 via-indigo-500/20 to-transparent"
        }
      `}
      />

      {/* Card body */}
      <div className="flex-1 px-5 pt-4 pb-4">
        {/* Title row + pin button */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2
            className="
            text-[15px] font-semibold text-white/90
            leading-snug tracking-tight line-clamp-2 flex-1
          "
          >
            {note.title}
          </h2>

          {/* Pin button */}
          <button
            onClick={pinHandler}
            disabled={pinning}
            title={pinned ? "Unpin note" : "Pin note"}
            className={`
              shrink-0 mt-0.5 p-1.5 rounded-lg
              transition-all duration-150
              ${
                pinned
                  ? "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                  : "text-zinc-700 hover:text-amber-400 hover:bg-amber-500/[0.08]"
              }
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          >
            {pinning ? (
              <svg
                className="animate-spin"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <circle
                  cx="6"
                  cy="6"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeOpacity="0.3"
                />
                <path
                  d="M6 1a5 5 0 015 5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              /* Pin icon — filled when active */
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M5 1.5h2M6 1.5v1M4 2.5h4l-.5 3 1.5 1v.5H7v3l-1 .5-1-.5v-3H2.5V7l1.5-1-.5-3z"
                  stroke="currentColor"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill={pinned ? "currentColor" : "none"}
                  fillOpacity={pinned ? "0.25" : "0"}
                />
              </svg>
            )}
          </button>
        </div>

        {/* Pinned badge */}
        {pinned && (
          <span
            className="
            inline-flex items-center gap-1 mb-2
            text-[10px] font-semibold text-amber-400
            bg-amber-500/10 border border-amber-500/20
            px-2 py-0.5 rounded-full
          "
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="currentColor"
              fillOpacity="0.7"
            >
              <circle cx="4" cy="4" r="3" />
            </svg>
            Pinned
          </span>
        )}

        {/* Preview */}
        <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-3 mb-3">
          {note.content}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 4).map((tag, i) => (
              <span
                key={tag}
                className={`
                  inline-flex items-center gap-1
                  text-[10px] font-medium border
                  px-2 py-0.5 rounded-full
                  ${TAG_COLORS[i % TAG_COLORS.length]}
                `}
              >
                <span className="opacity-50">#</span>
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span
                className="
                inline-flex items-center
                text-[10px] text-zinc-600
                bg-zinc-800/80 border border-white/[0.05]
                px-2 py-0.5 rounded-full
              "
              >
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Meta pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="
            inline-flex items-center gap-1
            text-[10px] text-zinc-600
            bg-zinc-800/80 border border-white/[0.05]
            px-2 py-1 rounded-full
          "
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <circle
                cx="4.5"
                cy="4.5"
                r="3.5"
                stroke="currentColor"
                strokeWidth="1.1"
              />
              <path
                d="M4.5 2.5v2.2l1.3 1"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
            {readMins} min
          </span>
          <span
            className="
            inline-flex items-center gap-1
            text-[10px] text-zinc-600
            bg-zinc-800/80 border border-white/[0.05]
            px-2 py-1 rounded-full
          "
          >
            {wordCount} words
          </span>
          <span className="ml-auto text-[10px] text-zinc-600">
            {timeAgo(note.updatedAt)}
          </span>
        </div>
      </div>

      {/* Footer actions */}
      <div
        className="
        px-5 py-3.5 mt-auto
        border-t border-white/[0.05] bg-zinc-900/40
        flex items-center justify-between gap-2
      "
      >
        {/* View + Edit */}
        <div className="flex items-center gap-1.5">
          <Link
            to={`/note/${note._id}`}
            className="
              inline-flex items-center gap-1.5 no-underline
              text-[12px] font-medium text-zinc-400 hover:text-white
              px-3 py-1.5 rounded-lg hover:bg-white/[0.06]
              transition-all duration-150
            "
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <circle
                cx="5.5"
                cy="5.5"
                r="2"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M1 5.5C2 3 3.6 2 5.5 2s3.5 1 4.5 3.5c-1 2.5-2.6 3.5-4.5 3.5S2 8 1 5.5z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            View
          </Link>

          <Link
            to={`/edit/${note._id}`}
            className="
              inline-flex items-center gap-1.5 no-underline
              text-[12px] font-medium text-zinc-400 hover:text-white
              px-3 py-1.5 rounded-lg hover:bg-white/[0.06]
              transition-all duration-150
            "
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M1.5 9.5l4-4 2 2-4 4H1.5v-2z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 2l2 2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            Edit
          </Link>
        </div>

        {/* Delete / Confirm */}
        <button
          onClick={deleteHandler}
          disabled={deleting}
          className={`
            inline-flex items-center gap-1.5
            text-[12px] font-medium
            px-3 py-1.5 rounded-lg
            transition-all duration-150
            ${
              confirming
                ? "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25"
                : "text-zinc-600 hover:text-red-400 hover:bg-red-500/[0.08]"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {deleting ? (
            <svg
              className="animate-spin"
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
            >
              <circle
                cx="5.5"
                cy="5.5"
                r="4.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeOpacity="0.3"
              />
              <path
                d="M5.5 1A4.5 4.5 0 0110 5.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          ) : confirming ? (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M2 5.5l2.5 2.5 4.5-4.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M1.5 3h8M4 3V2h3v1M4.5 5v3.5M6.5 5v3.5M2 3l.7 6.3A.8.8 0 003.5 10h4a.8.8 0 00.8-.7L9 3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          )}
          {deleting ? "Deleting…" : confirming ? "Confirm" : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
