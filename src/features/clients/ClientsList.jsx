import { useClients } from "./useClients";
import ClientItem from "./ClientItem";

export default function ClientsList({ search = "" }) {
  const { clients, loading, error } = useClients();
  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );
  if (clients.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-gray-400">Aucun client pour le moment.</p>
      </div>
    );
  }

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
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Tous les clients
          <span className="ml-2 text-xs font-normal text-gray-400">
            ({filtered.length}
            {search && ` sur ${clients.length}`})
          </span>
        </h2>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th className="px-6 pb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Client
            </th>
            <th className="hidden px-6 pb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase sm:table-cell">
              Email
            </th>
            <th className="hidden px-6 pb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase sm:table-cell">
              Téléphone
            </th>
            <th className="px-3 pb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((client) => (
            <ClientItem key={client.id} client={client} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
