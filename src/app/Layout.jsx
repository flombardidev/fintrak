import { Outlet, Link } from "react-router-dom";
import App from "../App";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <App />
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4">
        <h1 className="text-xl font-bold mb-6">CreditFlow</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/clients" className="hover:text-blue-600">
                Clients
              </Link>
            </li>
            <li>
              <Link to="/credits" className="hover:text-blue-600">
                Credits
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold">Welcome</h2>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
