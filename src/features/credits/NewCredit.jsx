import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCredits } from "./useCredits";
import { generateAmortizationSchedule } from "../../utils/loanCalculations";

function NewCredit() {
  const { id: clientId } = useParams(); // 👈 viene de la URL
  const { addCredit } = useCredits();
  const navigate = useNavigate();

  const [principal, setPrincipal] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [months, setMonths] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const numericPrincipal = Number(principal);
    const numericAnnualRate = Number(annualRate);
    const numericMonths = Number(months);

    // Validación mínima profesional
    if (numericPrincipal <= 0 || numericAnnualRate <= 0 || numericMonths <= 0) {
      alert("All fields must be positive numbers");
      return;
    }

    const schedule = generateAmortizationSchedule(
      numericPrincipal,
      numericAnnualRate,
      numericMonths,
    );

    const newCredit = {
      id: crypto.randomUUID(),
      clientId, // 👈 relación real
      principal: numericPrincipal,
      annualRate: numericAnnualRate,
      months: numericMonths,
      installment: schedule[0].installment,
      schedule,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    addCredit(newCredit);

    // Volvemos al cliente
    navigate(`/clients/${clientId}`);
  }

  return (
    <div className="max-w-xl rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">New Credit</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Principal (€)"
          className="w-full rounded border p-2"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Annual Rate (%)"
          className="w-full rounded border p-2"
          value={annualRate}
          onChange={(e) => setAnnualRate(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Months"
          className="w-full rounded border p-2"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Create Credit
        </button>
      </form>
    </div>
  );
}

export default NewCredit;
