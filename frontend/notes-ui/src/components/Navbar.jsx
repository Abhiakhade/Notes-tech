import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import AuthModal from "./AuthModal";

function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu & dropdown on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

const logoutHandler = async () => {
  try {
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setShowModal(false);
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-zinc-950/90 backdrop-blur-lg border-b border-white/[0.06] shadow-xl shadow-black/30"
            : "bg-zinc-950 border-b border-white/[0.06]"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group no-underline">
            <span
              className="
              w-8 h-8 rounded-lg flex items-center justify-center shrink-0
              bg-gradient-to-br from-violet-500 to-indigo-600
              shadow-lg shadow-violet-500/30
              group-hover:shadow-violet-500/50 transition-shadow duration-200
            "
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M2 2.5h11M2 5.5h7M2 8.5h9M2 11.5h5"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-[15px] font-semibold text-white/90 group-hover:text-white transition-colors">
              NoteSpace
            </span>
          </Link>

          {/* ── Desktop Right ── */}
          <div className="hidden sm:flex items-center gap-1.5">
            <Link
              to="/create"
              className="
                inline-flex items-center gap-1.5 no-underline
                text-[13px] font-medium text-zinc-300 hover:text-white
                px-3.5 py-2 rounded-lg hover:bg-white/[0.06]
                transition-all duration-150
              "
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M6.5 1v11M1 6.5h11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              New Note
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-white/10 mx-1" />

            {loading ? (
              /* Skeleton */
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-7 h-7 rounded-full bg-white/10 animate-pulse" />
                <div className="w-16 h-3 rounded bg-white/10 animate-pulse" />
              </div>
            ) : user ? (
              /* Avatar dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="
                    flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg
                    hover:bg-white/[0.06] transition-all duration-150
                    ring-0 focus-visible:ring-2 focus-visible:ring-violet-500/60
                  "
                >
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${user.email}&background=6d28d9&color=fff&size=80`
                    }
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
                  />
                  <div className="text-left leading-tight">
                    <p className="text-[12px] font-semibold text-white/90 truncate max-w-[96px]">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate max-w-[96px]">
                      {user.email}
                    </p>
                  </div>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`text-zinc-500 transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Dropdown panel */}
                <div
                  className={`
                  absolute right-0 mt-2 w-52
                  bg-zinc-900 border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50
                  transition-all duration-150 origin-top-right
                  ${dropdownOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
                `}
                >
                  <div className="px-3.5 py-3 border-b border-white/[0.06]">
                    <p className="text-[12px] font-medium text-white/80 truncate">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      to="/create"
                      className="
                        flex items-center gap-2 px-3 py-2 rounded-lg
                        text-[13px] text-zinc-300 hover:text-white hover:bg-white/[0.06]
                        transition-all duration-100 no-underline
                      "
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                      >
                        <path
                          d="M6.5 1v11M1 6.5h11"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      New Note
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="
                        w-full flex items-center gap-2 px-3 py-2 rounded-lg mt-0.5
                        text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/[0.08]
                        transition-all duration-100 text-left
                      "
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                      >
                        <path
                          d="M8.5 9.5l3-3-3-3M11.5 6.5H5M5 1.5H2a.5.5 0 00-.5.5v9a.5.5 0 00.5.5h3"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="
                  inline-flex items-center gap-1.5 ml-1
                  text-[13px] font-semibold text-white
                  bg-gradient-to-r from-violet-600 to-indigo-600
                  hover:from-violet-500 hover:to-indigo-500
                  px-4 py-2 rounded-lg
                  shadow-md shadow-violet-500/25 hover:shadow-violet-500/40
                  transition-all duration-150 active:scale-95
                "
              >
                Sign in
              </button>
            )}
          </div>

          {/* ── Mobile Right ── */}
          <div className="flex sm:hidden items-center gap-2">
            {!loading && user && (
              <img
                src={
                  user.photoURL ||
                  `https://ui-avatars.com/api/?name=${user.email}&background=6d28d9&color=fff&size=80`
                }
                alt="avatar"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
              />
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                {mobileOpen ? (
                  <path
                    d="M3 3l12 12M15 3L3 15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M2 5h14M2 9h10M2 13h12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <div
          className={`
          sm:hidden border-t border-white/[0.06]
          bg-zinc-950/95 backdrop-blur-lg
          overflow-hidden transition-all duration-200
          ${mobileOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}
        `}
        >
          <div className="px-4 py-3 space-y-0.5">
            <Link
              to="/create"
              className="
                flex items-center gap-2.5 no-underline
                text-[14px] font-medium text-zinc-300 hover:text-white
                px-3 py-2.5 rounded-lg hover:bg-white/[0.06]
                transition-all duration-150
              "
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1v12M1 7h12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              New Note
            </Link>

            {loading ? (
              <div className="flex items-center gap-2 px-3 py-2.5">
                <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
                <div className="w-24 h-3 rounded bg-white/10 animate-pulse" />
              </div>
            ) : user ? (
              <>
                <div className="px-3 py-2 text-[11px] text-zinc-500 truncate">
                  Signed in as{" "}
                  <span className="text-zinc-400">{user.email}</span>
                </div>
                <button
                  onClick={logoutHandler}
                  className="
                    w-full flex items-center gap-2.5 text-left
                    text-[14px] font-medium text-red-400 hover:text-red-300
                    px-3 py-2.5 rounded-lg hover:bg-red-500/[0.08]
                    transition-all duration-150
                  "
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M9 10.5l3.5-3.5L9 3.5M12.5 7H5M5 1H2v12h3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowModal(true);
                  setMobileOpen(false);
                }}
                className="
                  w-full text-left text-[14px] font-semibold text-white
                  bg-gradient-to-r from-violet-600 to-indigo-600
                  px-4 py-2.5 rounded-lg mt-1
                  shadow-md shadow-violet-500/20
                  transition-all duration-150 active:scale-[0.98]
                "
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>
      <div className="py-8" />

      {showModal && <AuthModal closeModal={() => setShowModal(false)} />}
    </>
  );
}

export default Navbar;