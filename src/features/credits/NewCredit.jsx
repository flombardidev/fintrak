import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCredits } from "./useCredits";
import { useClients } from "../clients/useClients";
import { generateAmortizationSchedule } from "../../utils/loanCalculations";

export default function NewCredit() {
  const { id: clientId }  = useParams();
  const { addCredit }     = useCredits();
  const { getClientById } = useClients();
  const navigate          = useNavigate();

  const client = getClientById(clientId);

  const [principal,  setPrincipal]  = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [months,     setMonths]     = useState("");
  const [errors,     setErrors]     = useState({});

  const validate = () => {
    const newErrors = {};
    if (!principal || Number(principal) <= 0)
      newErrors.principal = "Le montant doit être supérieur à 0";
    if (!annualRate || Number(annualRate) <= 0)
      newErrors.annualRate = "Le taux doit être supérieur à 0";
    if (!months || Number(months) <= 0 || !Number.isInteger(Number(months)))
      newErrors.months = "La durée doit être un entier positif";
    return newErrors;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    const p = Number(principal);
    const r = Number(annualRate);
    const m = Number(months);
    const schedule = generateAmortizationSchedule(p, r, m);

    await addCredit({
      id: crypto.randomUUID(),
      clientId,
      clientName: client?.name ?? "",
      principal: p, annualRate: r, months: m,
      installment: schedule[0].installment,
      schedule,
      status: "active",
      createdAt: new Date().toISOString(),
    });
    navigate(`/clients/${clientId}`);
  }

  const fieldClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200"
    }`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Nouveau crédit</h1>
        {client && <p className="text-sm text-gray-400 mt-0.5">Pour {client.name}</p>}
      </div>

      <div className="max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Principal (€)</label>
            <input type="number" placeholder="ex: 15000" value={principal}
              onChange={e => { setPrincipal(e.target.value); setErrors(p => ({ ...p, principal: "" })); }}
              className={fieldClass("principal")}
            />
            {errors.principal && <p className="text-xs text-red-500 mt-1 ml-1">{errors.principal}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Taux annuel (%)</label>
            <input type="number" placeholder="ex: 4.5" value={annualRate}
              onChange={e => { setAnnualRate(e.target.value); setErrors(p => ({ ...p, annualRate: "" })); }}
              className={fieldClass("annualRate")}
            />
            {errors.annualRate && <p className="text-xs text-red-500 mt-1 ml-1">{errors.annualRate}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Durée (mois)</label>
            <input type="number" placeholder="ex: 36" value={months}
              onChange={e => { setMonths(e.target.value); setErrors(p => ({ ...p, months: "" })); }}
              className={fieldClass("months")}
            />
            {errors.months && <p className="text-xs text-red-500 mt-1 ml-1">{errors.months}</p>}
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button"
              onClick={() => navigate(`/clients/${clientId}`)}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button type="submit"
              className="flex-1 rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition"
            >
              Créer
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}