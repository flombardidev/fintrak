import { Link } from "react-router-dom";
function ClientItem({ client }) {
  return (
    <Link to={`/clients/${client.id}`}>
      <div
        key={client.id}
        client={client}
        className="bg-white p-4 rounded-xl shadow"
      >
        <p className="font-semibold">{client.name}</p>
        <p>{client.email}</p>
        <p className="text-sm text-gray-500">{client.phone}</p>
      </div>
    </Link>
  );
}

export default ClientItem;
