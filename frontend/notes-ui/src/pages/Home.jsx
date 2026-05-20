import { useEffect, useState } from "react";
import API from "../services/api";
import NoteCard from "../components/NoteCard";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import AuthModal from "../components/AuthModal";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // AUTH CHECK
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
      if (!currentUser) {
        setNotes([]);
        setSearch("");
        setError("");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // FETCH NOTES
  const fetchNotes = async () => {
    if (!auth.currentUser) {
      setNotes([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = search.trim()
        ? await API.get(
            `/notes/search?q=${search}&userId=${auth.currentUser.uid}`,
          )
        : await API.get(`/notes?userId=${auth.currentUser.uid}`);
      setNotes(response.data);
    } catch (err) {
      setError("Failed to fetch notes. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // SEARCH DEBOUNCE
  useEffect(() => {
    if (!user) return;
    const debounce = setTimeout(fetchNotes, 500);
    return () => clearTimeout(debounce);
  }, [search, user]);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  // ── AUTH LOADING ──
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-violet-400 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
          <p className="text-sm text-zinc-500 tracking-wide">
            Verifying session…
          </p>
        </div>
      </div>
    );
  }

  // ── NOT LOGGED IN ──
  if (!user) {
    return (
      <>
        {/* Navbar */}
        <nav className="fixed top-0 inset-x-0 z-40 border-b border-white/[0.05] bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-violet-400"
                >
                  <path
                    d="M12 3l1.5 4.5H18l-3.75 2.75L15.75 15 12 12.25 8.25 15l1.5-4.75L6 7.5h4.5z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-white font-semibold text-[15px] tracking-tight">
                NoteSpace
              </span>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-sm font-semibold transition-all duration-150 shadow-lg shadow-violet-900/40"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              Login / Sign up
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 pt-16">
          {/* Ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
          </div>

          <div className="relative max-w-lg w-full text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-7 rounded-3xl bg-gradient-to-br from-violet-500/20 to-violet-800/20 border border-violet-500/20 flex items-center justify-center shadow-xl shadow-violet-900/30">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                className="text-violet-400"
              >
                <path
                  d="M6 10V8a6 6 0 1112 0v2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="12" cy="15" r="1.5" fill="currentColor" />
              </svg>
            </div>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Your personal workspace
            </span>

            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
              Your notes,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                beautifully organised
              </span>
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-sm mx-auto">
              Sign in to access your personal note-taking workspace. Capture
              ideas, thoughts, and everything in between.
            </p>

            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-semibold text-[15px] transition-all duration-150 shadow-2xl shadow-violet-900/50"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              Get started — it's free
            </button>

            <p className="mt-5 text-xs text-zinc-600">
              No credit card required · Sign in with Google or email
            </p>
          </div>
        </div>

        {showAuthModal && (
          <AuthModal closeModal={() => setShowAuthModal(false)} />
        )}
      </>
    );
  }

  // ── MAIN APP ──
  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-40 border-b border-white/[0.05] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-violet-400"
              >
                <path
                  d="M12 3l1.5 4.5H18l-3.75 2.75L15.75 15 12 12.25 8.25 15l1.5-4.75L6 7.5h4.5z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-white font-semibold text-[15px] tracking-tight">
              NoteSpace
            </span>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                className="w-8 h-8 rounded-full ring-2 ring-violet-500/30 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
            )}
            <span className="hidden sm:block text-sm text-zinc-400 max-w-[160px] truncate">
              {user.displayName || user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20 text-xs font-medium transition-all duration-150"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Page */}
      <div className="min-h-screen bg-[#0a0a0f] text-white pt-16">
        {/* Ambient glow */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-700/8 rounded-full blur-[160px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Your workspace
            </span>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  My Notes
                </h1>
                <p className="text-sm text-zinc-500 mt-1.5">
                  {loading
                    ? "Fetching your notes…"
                    : `${notes.length} note${notes.length !== 1 ? "s" : ""}${search ? ` for "${search}"` : ""}`}
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/[0.08] border border-red-500/20 text-red-400 text-[13px] font-medium px-4 py-3 rounded-xl mb-6">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
              <button
                onClick={fetchNotes}
                className="ml-auto text-[12px] underline underline-offset-2 hover:text-red-300 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <Loader />
          ) : notes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {notes.map((note, i) => (
                <div
                  key={note._id}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${i * 40}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <NoteCard note={note} fetchNotes={fetchNotes} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
      `}</style>
    </>
  );
}

export default Home;
