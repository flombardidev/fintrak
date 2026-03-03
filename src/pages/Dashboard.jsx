import Card from "../components/Card";
import { useClients } from "../features/clients/useClients";
import { useCredits } from "../features/credits/useCredits";
import { getGlobalMetrics } from "../utils/dashboardCalculations";
import { formatCurrency } from "../utils/format";

function Dashboard() {
  const { credits } = useCredits();
  const { clients } = useClients();

  const { activeCredits, activeClients, totalPendingInterest, totalDebt } =
    getGlobalMetrics(clients, credits);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card
          title="Total Loan Capital"
          value={formatCurrency(totalDebt)}
        />
        <Card
          title="Total Interest"
          value={formatCurrency(totalPendingInterest)}
        />
        <Card title="Active Credits" value={activeCredits} />
        <Card title="Active Clients" value={activeClients} />
      </div>
    </div>
  );
}

export default Dashboard;
