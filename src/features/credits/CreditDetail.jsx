import { useParams, Link } from "react-router-dom";
import { useCredits } from "./useCredits";
import {
  applyEarlyPayment,
  validateEarlyPaymentInput,
  payNextInstallment,
} from "../../utils/loanCalculations";

import { useState } from "react";
import { clientsCalculations } from "../../utils/clientsCalculations";
import { formatCurrency, formatDateTime } from "../../utils/format";
import { usePagination } from "../../hooks/usePagination";

const STATUS_MAP = {
  active: { label: "Actif", bg: "#ECFDF5", color: "#059669" },
  late: { label: "En retard", bg: "#FEF2F2", color: "#DC2626" },
  paid: { label: "Soldé", bg: "#EFF6FF", color: "#2563EB" },
};

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl bg-[#F7F6F3] p-4">
      <p className="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
        {label}
      </p>
      <p
        className={`font-mono text-lg font-medium ${accent ? "text-red-600" : "text-gray-900"}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function CreditDetail() {
  const { id } = useParams();
  const { getCreditByCreditId, updateCredit } = useCredits();
  const { calcTotalCreditDebt, calcTotalCreditInterests } =
    clientsCalculations();

  const credit = getCreditByCreditId(id);
  const [simulation, setSimulation] = useState(null);
  const [simError, setSimError] = useState("");

  const [earlyPaymentAmount, setEarlyPaymentAmount] = useState("");
  const [earlyPaymentMonth, setEarlyPaymentMonth] = useState("");

  const scheduleToShow = simulation || credit.schedule;

  const {
    visibleItems: visibleRows,
    hasMore,
    loadMore,
  } = usePagination(scheduleToShow, 10);

  if (!credit)
    return <p className="text-sm text-gray-400">Crédit introuvable.</p>;

  const nextUnpaid = credit.schedule.findIndex((row) => !row.paid);
  const allPaid = nextUnpaid === -1;
  const paidCount = credit.schedule.filter((row) => row.paid).length;

  const handlePayInstallment = () => {
    const updatedSchedule = payNextInstallment(credit.schedule);
    const allNowPaid = updatedSchedule.every((row) => row.paid);
    updateCredit(credit.id, {
      ...credit,
      schedule: updatedSchedule,
      status: allNowPaid ? "paid" : credit.status,
    });
  };
  const totalDebt = calcTotalCreditDebt(scheduleToShow);
  const totalInterests = calcTotalCreditInterests(scheduleToShow);
  const s = STATUS_MAP[credit.status] || STATUS_MAP.active;

  const handleSimulate = (e) => {
    e.preventDefault();
    setSimError("");
    try {
      const { amount, month: monthNumber } = validateEarlyPaymentInput(
        earlyPaymentAmount,
        earlyPaymentMonth,
      );
      setSimulation(
        applyEarlyPayment(
          credit.schedule,
          amount,
          monthNumber,
          credit.annualRate,
        ),
      );
    } catch (err) {
      setSimError(err.message);
    } finally {
      setEarlyPaymentAmount("");
      setEarlyPaymentMonth("");
    }
  };

  const handleConfirm = () => {
    if (simulation)
      updateCredit(credit.id, { ...credit, schedule: simulation });
    setSimulation(null);
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to={`/clients/${credit.clientId}`}
        className="text-xs text-gray-400 transition hover:text-gray-700"
      >
        ← Retour au client
      </Link>
      {/* Header */}
      <div
        className={`rounded-2xl border bg-white p-6 shadow-sm transition ${simulation ? "border-amber-300" : "border-gray-100"}`}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {credit.clientName}
            </h1>
            <p className="mt-0.5 text-sm text-gray-400">
              Créé le {formatDateTime(credit.createdAt)}
            </p>
          </div>
          <span
            style={{
              background: s.bg,
              color: s.color,
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: 99,
            }}
          >
            {s.label}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            label="Principal initial"
            value={`${formatCurrency(credit.principal)}`}
          />
          <StatCard
            label="Solde restant"
            value={`${formatCurrency(scheduleToShow[0].balance)}`}
          />
          <StatCard
            label="Mensualité"
            value={`${formatCurrency(credit.installment)}/mois`}
          />
          <StatCard
            label="Dette totale"
            value={`${formatCurrency(totalDebt)}`}
          />
          <StatCard
            label="Intérêts restants"
            value={`${formatCurrency(totalInterests)}`}
            accent
          />
          <StatCard label="Taux annuel" value={`${credit.annualRate}%`} />
        </div>

        {simulation && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="flex-1 text-sm font-medium text-amber-800">
              Mode simulation — voulez-vous confirmer le paiement anticipé ?
            </p>
            <button
              onClick={handleConfirm}
              className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-green-700"
            >
              Confirmer
            </button>
            <button
              onClick={() => setSimulation(null)}
              className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              Annuler
            </button>
          </div>
        )}
        {/* Payment */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {allPaid
                ? "Crédit soldé"
                : `Mensualité ${paidCount + 1} / ${credit.months}`}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {allPaid
                ? "Toutes les mensualités ont été payées"
                : `${formatCurrency(credit.installment)} à régler`}
            </p>
          </div>
          {!allPaid && (
            <button
              onClick={handlePayInstallment}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Payer
            </button>
          )}
          {allPaid && (
            <span
              style={{
                background: "#ECFDF5",
                color: "#059669",
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 99,
              }}
            >
              ✓ Soldé
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          style={{
            background: s.bg,
            color: s.color,
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 99,
          }}
        >
          {s.label}
        </span>
        <select
          value={credit.status}
          onChange={(e) =>
            updateCredit(credit.id, { ...credit, status: e.target.value })
          }
          className="cursor-pointer rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-500 transition focus:ring-2 focus:ring-gray-900 focus:outline-none"
        >
          <option value="active">Actif</option>
          <option value="late">En retard</option>
          <option value="paid">Soldé</option>
        </select>
      </div>
      {/* Early payment */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">
          Simuler un paiement anticipé
        </h2>
        <form
          onSubmit={handleSimulate}
          className="flex flex-col items-start gap-3 sm:flex-row sm:items-end"
        >
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Montant (€)
            </label>
            <input
              type="number"
              placeholder="ex: 5000"
              value={earlyPaymentAmount}
              onChange={(e) => setEarlyPaymentAmount(e.target.value)}
              className="w-36 rounded-xl border border-gray-200 px-4 py-2.5 font-mono text-sm transition focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Mois
            </label>
            <input
              type="number"
              placeholder="ex: 6"
              value={earlyPaymentMonth}
              onChange={(e) => setEarlyPaymentMonth(e.target.value)}
              className="w-28 rounded-xl border border-gray-200 px-4 py-2.5 font-mono text-sm transition focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Simuler
          </button>
          {simError && <p className="mt-2 text-xs text-red-500">{simError}</p>}
        </form>
      </div>
      {/* Amortization table */}
      <div className="overflow-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">
          Tableau d'amortissement
          {simulation && (
            <span className="ml-2 text-xs font-normal text-amber-600">
              (Simulation)
            </span>
          )}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-120">
            <thead>
              <tr>
                {[
                  "Mois",
                  "Mensualité",
                  "Intérêts",
                  "Capital",
                  "Solde restant",
                ].map((h) => (
                  <th
                    key={h}
                    className="pr-6 pb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr
                  key={row.month}
                  className={`border-t border-gray-50 transition ${row.paid ? "opacity-40" : "hover:bg-gray-50"}`}
                >
                  <td className="py-3 pr-6 font-mono text-sm text-gray-500">
                    {row.month}{" "}
                    {row.paid && (
                      <span className="text-xs text-green-500">✓</span>
                    )}
                  </td>
                  <td className="py-3 pr-6 font-mono text-sm text-gray-900">
                    {formatCurrency(row.installment)} €
                  </td>
                  <td className="py-3 pr-6 font-mono text-sm text-red-500">
                    {formatCurrency(row.interestPaid)} €
                  </td>
                  <td className="py-3 pr-6 font-mono text-sm text-gray-900">
                    {formatCurrency(row.principalPaid)} €
                  </td>
                  <td className="py-3 pr-6 font-mono text-sm font-medium text-gray-900">
                    {formatCurrency(row.balance)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {hasMore && (
            <button
              onClick={loadMore}
              className="mt-4 w-full rounded-xl border border-gray-100 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
            >
              Charger plus ({scheduleToShow.length - visibleRows.length}{" "}
              restants)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
