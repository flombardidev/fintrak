import { useParams } from "react-router-dom";
import { useCredits } from "./useCredits";
import { useState } from "react";
import { clientsCalculations } from "../../utils/clientsCalculations";
import { formatCurrency, formatDateTime } from "../../utils/format";
import {
  applyEarlyPayment,
  validateEarlyPaymentInput,
} from "../../utils/loanCalculations";

function CreditDetail() {
  const { id } = useParams();
  const { getCreditByCreditId, updateCredit } = useCredits();
  const { calcTotalCreditDebt, calcTotalCreditInterests } =
    clientsCalculations();

  const credit = getCreditByCreditId(id);
  // Estado para simulación
  const [simulation, setSimulation] = useState(null);
  const [earlyPaymentAmount, setEarlyPaymentAmount] = useState("");
  const [earlyPaymentMonth, setEarlyPaymentMonth] = useState("");

  if (!credit) {
    return <p>Credit not found.</p>;
  }

  // Elegimos qué schedule mostrar
  const scheduleToShow = simulation || credit.schedule;

  const totalDebt = calcTotalCreditDebt(scheduleToShow);

  const totalInterests = calcTotalCreditInterests(scheduleToShow);

  // Función de simulación
  const handleSimulate = (e) => {
    e.preventDefault();
    try {
      const { amount, month: monthNumber } = validateEarlyPaymentInput(
        earlyPaymentAmount,
        earlyPaymentMonth,
      );
      const newSchedule = applyEarlyPayment(
        credit.schedule,
        amount,
        monthNumber,
        credit.annualRate,
      );

      setSimulation(newSchedule);
    } catch (err) {
      alert(err.message);
      return;
    } finally {
      resetInputs();
    }
  };

  // Función para confirmar
  const handleConfirm = () => {
    if (simulation) {
      updateCredit(credit.id, { ...credit, schedule: simulation });
      setSimulation(null);
      alert("Pago adelantado confirmado");
    }
    resetInputs();
  };

  // Función para cancelar simulación
  const handleCancel = () => {
    setSimulation(null);
  };

  //reset inputs
  const resetInputs = () => {
    setEarlyPaymentAmount("");
    setEarlyPaymentMonth("");
  };

  return (
    <div className={`space-y-6 ${simulation && "bg-amber-200"}`}>
      {/* Header */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-2 text-2xl font-bold">{credit.clientName}</h2>
        <p className="mt-2 font-semibold">
          Total Credit Debt: €{formatCurrency(totalDebt)}
        </p>
        <p className="text-gray-500">
          Total Interest: €{formatDateTime(credit.createdAt)}
        </p>
        <p className="text-red-600">
          Total Interest: €{formatCurrency(totalInterests)}
        </p>
        <p>Initial Principal: €{formatCurrency(credit.principal)}</p>
        <p>Remaining Principal: €{formatCurrency(scheduleToShow[0].balance)}</p>
        <p>Annual Rate: {credit.annualRate}%</p>
        <p>Months: {credit.months}</p>
        <p className="font-semibold">
          Installment: {formatCurrency(credit.installment)}
        </p>
      </div>

      {/* Pago adelantado */}
      <div className="space-y-4 rounded-xl bg-white p-6 shadow">
        <h3 className="text-lg font-semibold">Simulate Early Payment</h3>

        <form onSubmit={handleSimulate} className="flex items-center gap-4">
          <input
            type="number"
            placeholder="Amount (€)"
            value={earlyPaymentAmount}
            onChange={(e) => setEarlyPaymentAmount(e.target.value)}
            className="w-32 rounded border p-2"
          />
          <input
            type="number"
            placeholder="Month number"
            value={earlyPaymentMonth}
            onChange={(e) => setEarlyPaymentMonth(e.target.value)}
            className="w-32 rounded border p-2"
          />
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Simulate
          </button>
        </form>
      </div>

      {/* Amortization Table */}
      <div className="overflow-auto rounded-xl bg-white p-6 shadow">
        {simulation && (
          <div className="mt-2 flex gap-2 bg-gray-200 p-1">
            <h3>Would you like to confirm the Early Payment?</h3>
            <button
              onClick={handleConfirm}
              className="rounded bg-green-600 px-4 py-2 text-white"
            >
              Confirm
            </button>

            <button
              onClick={handleCancel}
              className="rounded bg-red-600 px-4 py-2 text-white"
            >
              Cancel
            </button>
          </div>
        )}
        <h3 className="mb-4 text-lg font-semibold">
          Amortization Schedule {simulation ? "(Simulation)" : ""}
        </h3>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Month</th>
              <th className="py-2 text-left">Payment</th>
              <th className="py-2 text-left">Interest</th>
              <th className="py-2 text-left">Principal</th>
              <th className="py-2 text-left">Remaining</th>
            </tr>
          </thead>

          <tbody>
            {scheduleToShow.map((row) => (
              <tr key={row.month} className="border-b">
                <td className="py-2">{row.month}</td>
                <td>{formatCurrency(row.installment)}</td>
                <td>{formatCurrency(row.interestPaid)}</td>
                <td>{formatCurrency(row.principalPaid)}</td>
                <td>{formatCurrency(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreditDetail;
