import { useParams, Link } from "react-router-dom";
import { useClients } from "./useClients";
import { useCredits } from "../credits/useCredits";
import CreditItem from "../credits/CreditItem";
import { clientsCalculations } from "../../utils/clientsCalculations";
import { formatCurrency, formatDateTime } from "../../utils/format";

function ClientDetail() {
  const { id } = useParams();

  const { getClientById } = useClients();
  const { getCreditsByClientId } = useCredits();
  const { calcTotalClientDebt, calcTotalClientInterests } =
    clientsCalculations();

  const client = getClientById(id);

  if (!client) {
    return <p>Client not found.</p>;
  }

  const clientCredits = getCreditsByClientId(id);

  const totalCredits = clientCredits.length;
  const totalDebt = calcTotalClientDebt(clientCredits);
  const totalPendingInterest = calcTotalClientInterests(clientCredits);
  return (
    <div className="space-y-6">
      {/* Client Info */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-2 text-2xl font-bold">{client.name}</h2>
        <p>Email: {client.email}</p>
        <p>Created: {formatDateTime(client.createdAt)}</p>
        <p>Credits quantity: {totalCredits}</p>
        <p>Total debt: {formatCurrency(totalDebt)}</p>
        <p>Total pending interests: {formatCurrency(totalPendingInterest)}</p>
      </div>

      {/* Credits Section */}
      <div className="rounded-xl bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Credits</h3>

          <Link
            to={`/clients/${id}/new-credit`}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            New Credit
          </Link>
        </div>

        {clientCredits.length === 0 ? (
          <p className="text-gray-500">No credits yet.</p>
        ) : (
          <ul className="space-y-3">
            {clientCredits.map((credit) => (
              <CreditItem key={credit.id} credit={credit} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ClientDetail;
