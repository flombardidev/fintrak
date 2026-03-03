import ClientsList from "./ClientsList";
import NewClient from "./NewClient";

function Clients() {
  return (
    <div className="space-y-6">
      {/* FORM */}
      <NewClient />

      {/* LIST */}
      <ClientsList />
    </div>
  );
}

export default Clients;
