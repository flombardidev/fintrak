import { useState } from "react";
import ClientsList from "./ClientsList";
import NewClient from "./NewClient";

export default function Clients() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Gérez vos clients et leurs contrats
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm placeholder-gray-400 transition focus:ring-2 focus:ring-gray-900 focus:outline-none md:w-72"
        />
      </div>

      <div className="flex flex-col-reverse gap-6 md:grid md:grid-cols-3">
        <div className="md:col-span-2">
          <ClientsList search={search} />
        </div>
        <div>
          <NewClient />
        </div>
      </div>
    </div>
  );
}
