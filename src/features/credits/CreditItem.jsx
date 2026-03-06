import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/format";

const STATUS_MAP = {
  active: { label: "Actif", bg: "#ECFDF5", color: "#059669" },
  late: { label: "En retard", bg: "#FEF2F2", color: "#DC2626" },
  paid: { label: "Soldé", bg: "#EFF6FF", color: "#2563EB" },
};

export default function CreditItem({ credit }) {
  const s = STATUS_MAP[credit.status] || STATUS_MAP.active;

  const paidCount = credit.schedule?.filter((r) => r.paid).length ?? 0;
  const totalCount = credit.schedule?.length ?? 0;
  const pct = totalCount ? Math.round((paidCount / totalCount) * 100) : 0;

  return (
    <li className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#F7F6F3] px-5 py-4 transition hover:bg-gray-100">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-3">
          <p className="font-mono text-sm font-medium text-gray-900">
            {formatCurrency(credit.principal)}
          </p>
          <span
            style={{
              background: s.bg,
              color: s.color,
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 99,
            }}
          >
            {s.label}
          </span>
        </div>
        <p className="mb-2 text-xs text-gray-400">
          {credit.annualRate}% · {credit.months} mois ·{" "}
          {formatCurrency(credit.installment)} €/mois
          {paidCount > 0 && (
            <span className="ml-2 font-medium text-green-600">
              {paidCount}/{totalCount} payées
            </span>
          )}
        </p>
        <div className="h-1 w-48 rounded-full bg-gray-200">
          <div
            className="h-1 rounded-full bg-gray-900 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <Link
        to={`/credits/${credit.id}`}
        className="ml-4 shrink-0 text-xs font-medium text-gray-500 transition hover:text-gray-900"
      >
        Voir →
      </Link>
    </li>
  );
}
