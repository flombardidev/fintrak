import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { useNavigate } from "react-router-dom";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: "/clients",
    label: "Clients",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/credits",
    label: "Crédits",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
];

export default function Layout() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="flex h-screen bg-[#F7F6F3]">
      {/* Sidebar — solo desktop */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-gray-100 bg-white px-4 py-6 md:flex">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-gray-900">
            Fintrak
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon }) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="mt-auto">
          <div className="px-2 py-2">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                {user?.email?.[0].toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-gray-800">
                  {user?.email ?? "User"}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-2 py-1.5 text-left text-xs font-medium text-gray-400 transition hover:bg-gray-50 hover:text-gray-900"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom nav — solo mobile */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around border-t border-gray-100 bg-white px-4 py-2 md:hidden">
        {navItems.map(({ to, label, icon }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 transition-all ${
                isActive ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <span className={isActive ? "text-gray-900" : "text-gray-400"}>
                {icon}
              </span>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-gray-400 transition-all"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-xs font-medium">Sortir</span>
        </button>
      </nav>
    </div>
  );
}
