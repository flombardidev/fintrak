import { useParams, Link } from "react-router-dom";
import { useClients } from "./useClients";
import { useCredits } from "../credits/useCredits";
import CreditItem from "../credits/CreditItem";
import { clientsCalculations } from "../../utils/clientsCalculations";
import { formatCurrency, formatDateTime } from "../../utils/format";

const AVATAR_COLORS = ["#6366F1","#F59E0B","#10B981","#EC4899","#8B5CF6","#3B82F6","#EF4444","#14B8A6"];
function avatarColor(name) { return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]; }
function initials(name) { return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2); }

function StatCard({ label, value }) {
  return (
    <div className="bg-[#F7F6F3] rounded-xl p-3 md:p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 leading-tight">{label}</p>
      <p className="text-sm md:text-lg font-medium text-gray-900 font-mono">{value}</p>
    </div>
  );
}

export default function ClientDetail() {
  const { id } = useParams();
  const { getClientById } = useClients();
  const { getCreditsByClientId } = useCredits();
  const { calcTotalClientDebt, calcTotalClientInterests } = clientsCalculations();

  const client = getClientById(id);
  if (!client) return <p className="text-sm text-gray-400">Client introuvable.</p>;

  const clientCredits      = getCreditsByClientId(id);
  const totalDebt          = calcTotalClientDebt(clientCredits);
  const totalPendingInterest = calcTotalClientInterests(clientCredits);

  return (
    <div className="space-y-6">

      {/* Back */}
      <Link to="/clients" className="text-xs text-gray-400 hover:text-gray-700 transition">
        ← Retour aux clients
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: avatarColor(client.name),
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 16, fontWeight: 600, flexShrink: 0,
          }}>
            {initials(client.name)}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{client.name}</h1>
            <p className="text-sm text-gray-400">{client.email} · Client depuis {formatDateTime(client.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Crédits"           value={clientCredits.length} />
          <StatCard label="Dette totale"       value={`${formatCurrency(totalDebt)}`} />
          <StatCard label="Intérêts en attente" value={`${formatCurrency(totalPendingInterest)} `} />
        </div>
      </div>

      {/* Credits */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-900">
            Crédits
            <span className="ml-2 text-xs font-normal text-gray-400">({clientCredits.length})</span>
          </h2>
          <Link
            to={`/clients/${id}/new-credit`}
            className="text-sm font-medium text-white rounded-xl px-4 py-2 bg-gray-900 hover:bg-gray-700 transition"
          >
            + Nouveau crédit
          </Link>
        </div>

        {clientCredits.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun crédit pour ce client.</p>
        ) : (
          <ul className="space-y-3">
            {clientCredits.map(credit => (
              <CreditItem key={credit.id} credit={credit} />
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}