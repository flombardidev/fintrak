import { useCredits } from "./useCredits";
import CreditItem from "./CreditItem";

export default function CreditList() {
  const { credits, loading, error } = useCredits();

  if (loading)
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-gray-400">Chargement...</p>
      </div>
    );

  if (error)
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-red-400">Erreur de connexion au serveur.</p>
      </div>
    );
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Crédits</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Tous les contrats de financement
          </p>
        </div>
      </div>

      {credits.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-400">Aucun crédit pour le moment.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            {credits.length} contrat{credits.length > 1 ? "s" : ""}
          </p>
          <ul className="space-y-3">
            {credits.map((credit) => (
              <CreditItem key={credit.id} credit={credit} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
