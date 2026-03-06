import { useClients } from "../features/clients/useClients";
import { useCredits } from "../features/credits/useCredits";
import {
  clientsCalculations,
  calcCreditsByStatus,
  calcDebtEvolution,
} from "../utils/clientsCalculations";
import { formatCurrency } from "../utils/format";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { Link } from "react-router-dom";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#6366F1",
  "#F59E0B",
  "#10B981",
  "#EC4899",
  "#8B5CF6",
  "#3B82F6",
  "#EF4444",
  "#14B8A6",
];
function avatarColor(name) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}
function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StatusBadge({ status }) {
  const map = {
    active: { label: "Actif", bg: "#ECFDF5", color: "#059669" },
    late: { label: "En retard", bg: "#FEF2F2", color: "#DC2626" },
    paid: { label: "Soldé", bg: "#EFF6FF", color: "#2563EB" },
  };
  const s = map[status] || map.active;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 99,
      }}
    >
      {s.label}
    </span>
  );
}

function MetricCard({ label, value, sub, progress }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:p-6">
      <p className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
        {label}
      </p>
      <p className="truncate font-mono text-base font-medium text-gray-900 md:text-2xl">
        {value}
      </p>
      {sub && <p className="mt-1 truncate text-xs text-gray-400">{sub}</p>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-1 rounded-full bg-gray-100">
            <div
              className="h-1 rounded-full bg-gray-900 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">{progress}% actifs</p>
        </div>
      )}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { clients } = useClients();
  const { credits } = useCredits();
  const { calcDashboardMetrics } = clientsCalculations();

  const metrics = calcDashboardMetrics(credits);
  const activeCredits = credits.filter((c) => c.status === "active").length;
  const lateCredits = credits.filter((c) => c.status === "late").length;
  const paidCredits = credits.filter((c) => c.status === "paid").length;
  const activePercent = credits.length
    ? Math.round((activeCredits / credits.length) * 100)
    : 0;

  const recentClients = [...clients].slice(-5).reverse();
  const recentCredits = [...credits].slice(-3).reverse();

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Vue globale ·{" "}
            {new Date().toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Link
          to="/clients"
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          + Nouveau client
        </Link>
      </div>

      {/* Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Dette totale"
          value={`${formatCurrency(metrics.totalDebt)} `}
          sub="Tous crédits confondus"
        />
        <MetricCard
          label="Intérêts"
          value={`${formatCurrency(metrics.totalInterests)} `}
          sub="Intérêts restants"
        />
        <MetricCard label="Clients" value={clients.length} progress={100} />
        <MetricCard
          label="Crédits"
          value={credits.length}
          progress={activePercent}
        />
      </div>

      {/* Table + right panel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Clients table */}
        <div className="col-span-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Clients récents
            </h2>
            <Link
              to="/clients"
              className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700 md:px-4"
            >
              <span className="hidden sm:inline">+ Nouveau client</span>
              <span className="sm:hidden">+</span>
            </Link>
          </div>

          {recentClients.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-gray-400">
              Aucun client pour le moment.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 pb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    Client
                  </th>
                  <th className="hidden px-6 pb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase sm:table-cell">
                    Email
                  </th>
                  <th className="px-6 pb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-t border-gray-50 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/clients/${client.id}`}
                        className="flex items-center gap-3"
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: avatarColor(client.name),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {initials(client.name)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {client.name}
                        </span>
                      </Link>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-gray-400 sm:table-cell">
                      {client.email}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status="active" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Recent credits */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Crédits récents
              </h2>
              <Link
                to="/credits"
                className="text-xs text-gray-400 transition hover:text-gray-700"
              >
                Voir tout →
              </Link>
            </div>
            {recentCredits.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun crédit.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {recentCredits.map((credit) => {
                  const paid =
                    credit.schedule?.filter((r) => r.balance === 0).length ?? 0;
                  const pct = credit.months
                    ? Math.min(100, Math.round((paid / credit.months) * 100))
                    : 0;
                  return (
                    <div key={credit.id}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <div>
                          <p className="font-mono text-sm font-medium text-gray-900">
                            {formatCurrency(credit.principal)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {credit.clientName} · {credit.months} mois
                          </p>
                        </div>
                        <StatusBadge status={credit.status} />
                      </div>
                      <div className="h-1 rounded-full bg-gray-100">
                        <div
                          className="h-1 rounded-full bg-gray-900"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Distribution */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">
              Répartition
            </h2>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Actifs", value: activeCredits, color: "#1A1A1A" },
                { label: "En retard", value: lateCredits, color: "#DC2626" },
                { label: "Soldés", value: paidCredits, color: "#2563EB" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: color,
                      }}
                    />
                    <span className="text-xs text-gray-600">{label}</span>
                  </div>
                  <span className="font-mono text-xs font-medium">
                    {value} / {credits.length}
                  </span>
                </div>
              ))}
            </div>
            {credits.length > 0 && (
              <div className="mt-4 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                <div
                  style={{
                    background: "#1A1A1A",
                    width: `${(activeCredits / credits.length) * 100}%`,
                  }}
                />
                <div
                  style={{
                    background: "#DC2626",
                    width: `${(lateCredits / credits.length) * 100}%`,
                  }}
                />
                <div
                  style={{
                    background: "#2563EB",
                    width: `${(paidCredits / credits.length) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts — full width row */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Pie — distribution par status */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Répartition des crédits
          </h2>
          {credits.length === 0 ? (
            <p className="py-8 text-center text-xs text-gray-400">
              Aucun crédit
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={calcCreditsByStatus(credits)}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {calcCreditsByStatus(credits).map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} crédit${value > 1 ? "s" : ""}`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #F3F4F6",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          {/* Leyenda manual */}
          <div className="mt-2 flex justify-center gap-4">
            {calcCreditsByStatus(credits).map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: entry.color }}
                />
                <span className="text-xs text-gray-500">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Line — évolution de la dette */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Évolution de la dette
          </h2>
          {credits.length === 0 ? (
            <p className="py-8 text-center text-xs text-gray-400">
              Aucun crédit
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={calcDebtEvolution(credits)}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickLine={false}
                  interval={9}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v) => [
                    `${v.toLocaleString("fr-FR")} €`,
                    "Dette totale",
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #F3F4F6",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="debt"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
