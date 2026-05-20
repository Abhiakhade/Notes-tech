import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import {auth} from "../firebase"
function CreateNote() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const titleLimit = 100;
  const contentLimit = 2000;

  // ── Tag helpers ──
  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!tag || tags.includes(tag) || tags.length >= 8) return;
    setTags((prev) => [...prev, tag]);
  };

  const handleTagKeyDown = (e) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

  // ── Submit ──
  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required.");
    if (!content.trim()) return setError("Content is required.");

    try {
      setLoading(true);
      await API.post("/notes", {  userId: auth.currentUser.uid, title, content, tags });
      navigate("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = !title.trim() && !content.trim();

  const TAG_COLORS = [
    "text-violet-400 bg-violet-500/10 border-violet-500/25",
    "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
    "text-sky-400 bg-sky-500/10 border-sky-500/25",
    "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    "text-amber-400 bg-amber-500/10 border-amber-500/25",
    "text-rose-400 bg-rose-500/10 border-rose-500/25",
    "text-pink-400 bg-pink-500/10 border-pink-500/25",
    "text-teal-400 bg-teal-500/10 border-teal-500/25",
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* ── Back + Header ── */}
        <div className="mb-8">
          <Link
            to="/"
            className="
              inline-flex items-center gap-1.5 no-underline
              text-[13px] text-zinc-500 hover:text-zinc-300
              transition-colors duration-150 mb-5 group
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

          <div className="flex items-center gap-2 mb-2">
            <span
              className="
              inline-flex items-center gap-1.5
              text-[11px] font-semibold tracking-widest uppercase
              text-violet-400 bg-violet-500/10
              border border-violet-500/20
              px-2.5 py-1 rounded-full
            "
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M5 1v8M1 5h8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              New note
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Create a note</h1>
          <p className="text-[14px] text-zinc-500 mt-1.5">
            Capture your thought. It'll be saved instantly.
          </p>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div
            className="
            flex items-center gap-3
            bg-red-500/[0.08] border border-red-500/20
            text-red-400 text-[13px] font-medium
            px-4 py-3 rounded-xl mb-6
          "
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              className="shrink-0"
            >
              <circle
                cx="7.5"
                cy="7.5"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M7.5 4.5v3.5M7.5 10h.01"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </div>
        )}

        {/* ── Form Card ── */}
        <form
          onSubmit={submitHandler}
          className="
            bg-zinc-900/60 border border-white/[0.07]
            rounded-2xl overflow-hidden
            shadow-2xl shadow-black/30
          "
        >
          {/* Title field */}
          <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] font-semibold text-zinc-400 uppercase tracking-widest">
                Title
              </label>
              <span
                className={`text-[11px] tabular-nums transition-colors duration-150 ${
                  title.length > titleLimit * 0.9
                    ? "text-amber-400"
                    : "text-zinc-600"
                }`}
              >
                {title.length} / {titleLimit}
              </span>
            </div>
            <input
              type="text"
              placeholder="Give your note a title…"
              value={title}
              maxLength={titleLimit}
              onChange={(e) => setTitle(e.target.value)}
              className="
                w-full bg-transparent outline-none
                text-white text-[18px] font-semibold
                placeholder-zinc-700 caret-violet-400
              "
            />
          </div>

          {/* Content field */}
          <div className="px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] font-semibold text-zinc-400 uppercase tracking-widest">
                Content
              </label>
              <span
                className={`text-[11px] tabular-nums transition-colors duration-150 ${
                  content.length > contentLimit * 0.9
                    ? "text-amber-400"
                    : "text-zinc-600"
                }`}
              >
                {content.length} / {contentLimit}
              </span>
            </div>
            <textarea
              rows={9}
              placeholder="Start writing…"
              value={content}
              maxLength={contentLimit}
              onChange={(e) => setContent(e.target.value)}
              className="
                w-full bg-transparent outline-none resize-none
                text-zinc-300 text-[14px] leading-relaxed
                placeholder-zinc-700 caret-violet-400
              "
            />
          </div>

          {/* ── Tags field ── */}
          <div className="px-6 pt-5 pb-5 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[12px] font-semibold text-zinc-400 uppercase tracking-widest">
                Tags
              </label>
              <span
                className={`text-[11px] tabular-nums transition-colors duration-150 ${
                  tags.length >= 8 ? "text-amber-400" : "text-zinc-600"
                }`}
              >
                {tags.length} / 8
              </span>
            </div>

            {/* Tag chips + input */}
            <div
              className="
              flex flex-wrap gap-2 items-center
              min-h-[38px]
            "
            >
              {tags.map((tag, i) => (
                <span
                  key={tag}
                  className={`
                    inline-flex items-center gap-1.5
                    text-[12px] font-medium
                    border px-2.5 py-1 rounded-full
                    transition-all duration-150
                    ${TAG_COLORS[i % TAG_COLORS.length]}
                  `}
                >
                  <span className="opacity-60">#</span>
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="
                      ml-0.5 opacity-50 hover:opacity-100
                      transition-opacity duration-100
                      leading-none
                    "
                    aria-label={`Remove ${tag}`}
                  >
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path
                        d="M1.5 1.5l6 6M7.5 1.5l-6 6"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </span>
              ))}

              {/* Input */}
              {tags.length < 8 && (
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => {
                    if (tagInput.trim()) {
                      addTag(tagInput);
                      setTagInput("");
                    }
                  }}
                  placeholder={
                    tags.length === 0
                      ? "Add tags… (Enter, comma, or space)"
                      : "Add more…"
                  }
                  className="
                    flex-1 min-w-[140px] bg-transparent outline-none
                    text-[13px] text-zinc-300 placeholder-zinc-700
                    caret-violet-400
                  "
                />
              )}
            </div>

            {/* Helper hint */}
            <p className="text-[11px] text-zinc-600 mt-2.5">
              Press{" "}
              <kbd
                className="
                px-1.5 py-0.5 rounded-md text-[10px]
                bg-zinc-800 border border-white/[0.08]
                text-zinc-500 font-mono
              "
              >
                Enter
              </kbd>{" "}
              ,{" "}
              <kbd
                className="
                px-1.5 py-0.5 rounded-md text-[10px]
                bg-zinc-800 border border-white/[0.08]
                text-zinc-500 font-mono
              "
              >
                ,
              </kbd>{" "}
              or{" "}
              <kbd
                className="
                px-1.5 py-0.5 rounded-md text-[10px]
                bg-zinc-800 border border-white/[0.08]
                text-zinc-500 font-mono
              "
              >
                Space
              </kbd>{" "}
              to add ·{" "}
              <kbd
                className="
                px-1.5 py-0.5 rounded-md text-[10px]
                bg-zinc-800 border border-white/[0.08]
                text-zinc-500 font-mono
              "
              >
                Backspace
              </kbd>{" "}
              to remove last
            </p>
          </div>

          {/* Footer actions */}
          <div
            className="
            px-6 py-4 border-t border-white/[0.06]
            bg-zinc-900/40
            flex items-center justify-between gap-3
          "
          >
            <Link
              to="/"
              className="
                text-[13px] font-medium text-zinc-500
                hover:text-zinc-300 no-underline
                px-4 py-2 rounded-lg hover:bg-white/[0.05]
                transition-all duration-150
              "
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading || isEmpty}
              className="
                inline-flex items-center gap-2
                text-[13px] font-semibold text-white
                bg-gradient-to-r from-violet-600 to-indigo-600
                hover:from-violet-500 hover:to-indigo-500
                disabled:from-zinc-700 disabled:to-zinc-700
                disabled:text-zinc-500 disabled:cursor-not-allowed
                px-5 py-2.5 rounded-xl
                shadow-lg shadow-violet-500/25
                hover:shadow-violet-500/40 disabled:shadow-none
                transition-all duration-150 active:scale-95 disabled:active:scale-100
              "
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                  >
                    <circle
                      cx="6.5"
                      cy="6.5"
                      r="5.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeOpacity="0.3"
                    />
                    <path
                      d="M6.5 1A5.5 5.5 0 0112 6.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Save note
                </>
              )}
            </button>
          </div>
        </form>

        {/* Word count */}
        {content.trim() && (
          <p className="text-center text-[11px] text-zinc-600 mt-4">
            {content.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        )}
      </div>
    </div>
  );
}

export default CreateNote;
