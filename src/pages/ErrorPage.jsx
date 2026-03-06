import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F7F6F3] text-center px-4">
      <p className="text-6xl font-semibold text-gray-900 font-mono">Oops</p>
      <p className="text-sm text-gray-400 mt-3 mb-2">Une erreur inattendue s'est produite.</p>
      <p className="text-xs text-gray-300 mb-6 font-mono">
        {error?.statusText || error?.message || "Erreur inconnue"}
      </p>
      <a
        to="/dashboard"
        className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 rounded-xl px-4 py-2 transition"
      >
        Retour au dashboard
      </a>
    </div>
  );
}