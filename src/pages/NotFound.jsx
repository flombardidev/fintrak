import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-6xl font-semibold text-gray-900">404</p>
      <p className="mt-3 mb-6 text-sm text-gray-400">
        Cette page n'existe pas.
      </p>
      <Link
        to="/dashboard"
        className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
      >
        Retour au dashboard
      </Link>
    </div>
  );
}
