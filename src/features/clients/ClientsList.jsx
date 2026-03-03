import ClientItem from "./ClientItem";
import { useClients } from "./useClients";

function ClientsList() {
  const { clients } = useClients();
  return (
    <div className="space-y-4 ">
      <h2 className="text-xl font-semibold">Clients</h2>

      {clients.length === 0 && <p>No clients yet.</p>}
      <div className="flex flex-col gap-4">
        {clients.map((client) => (
          <ClientItem key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}

export default ClientsList;
