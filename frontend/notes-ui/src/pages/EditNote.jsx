import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [original, setOriginal] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const titleLimit = 100;
  const contentLimit = 2000;

  // ── Fetch ──
  const fetchNote = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/notes/${id}`);
      setTitle(data.title);
      setContent(data.content);
      setOriginal({ title: data.title, content: data.content });
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

  // ── Submit ──
  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required.");
    if (!content.trim()) return setError("Content is required.");

    try {
      setSubmitLoading(true);
      await API.put(`/notes/${id}`, { title, content });
      navigate("/");
    } catch (err) {
      setError("Failed to update note. Please try again.");
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const isDirty = title !== original.title || content !== original.content;
  const isEmpty = !title.trim() || !content.trim();

  if (loading) return <Loader />;

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
              text-amber-400 bg-amber-500/10
              border border-amber-500/20
              px-2.5 py-1 rounded-full
            "
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1.5 8.5l5.5-5.5 2 2-5.5 5.5H1.5v-2z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Editing
            </span>

            {/* Unsaved indicator */}
            {isDirty && (
              <span
                className="
                inline-flex items-center gap-1
                text-[11px] text-zinc-500
                bg-zinc-800 border border-white/[0.06]
                px-2.5 py-1 rounded-full
              "
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Unsaved changes
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Edit note</h1>
          <p className="text-[14px] text-zinc-500 mt-1.5">
            Make your changes below and save when ready.
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
                placeholder-zinc-700 caret-amber-400
              "
            />
          </div>

          {/* Content field */}
          <div className="px-6 pt-5 pb-4">
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
              rows={10}
              placeholder="Start writing…"
              value={content}
              maxLength={contentLimit}
              onChange={(e) => setContent(e.target.value)}
              className="
                w-full bg-transparent outline-none resize-none
                text-zinc-300 text-[14px] leading-relaxed
                placeholder-zinc-700 caret-amber-400
              "
            />
          </div>

          {/* Footer actions */}
          <div
            className="
            px-6 py-4 border-t border-white/[0.06]
            bg-zinc-900/40
            flex items-center justify-between gap-3
          "
          >
            <div className="flex items-center gap-2">
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

              {/* Discard button — only when dirty */}
              {isDirty && (
                <button
                  type="button"
                  onClick={() => {
                    setTitle(original.title);
                    setContent(original.content);
                  }}
                  className="
                    text-[13px] font-medium text-zinc-500
                    hover:text-zinc-300
                    px-4 py-2 rounded-lg hover:bg-white/[0.05]
                    transition-all duration-150
                  "
                >
                  Discard
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={submitLoading || isEmpty || !isDirty}
              className="
                inline-flex items-center gap-2
                text-[13px] font-semibold text-white
                bg-gradient-to-r from-amber-500 to-orange-500
                hover:from-amber-400 hover:to-orange-400
                disabled:from-zinc-700 disabled:to-zinc-700
                disabled:text-zinc-500 disabled:cursor-not-allowed
                px-5 py-2.5 rounded-xl
                shadow-lg shadow-amber-500/20
                hover:shadow-amber-500/30 disabled:shadow-none
                transition-all duration-150 active:scale-95 disabled:active:scale-100
              "
            >
              {submitLoading ? (
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
                  Save changes
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

export default EditNote;
