import { createContext, useEffect, useState } from "react";

const ClientsContext = createContext();
function ClientsProvider({ children }) {
  const [clients, setClients] = useState(() => {
    const stored = localStorage.getItem("clients");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  function addClient(client) {
    setClients((prevClients) => [...prevClients, client]);
  }
  function getClientById(id) {
    return clients.find((c) => c.id === id);
  }

  const value = { clients, addClient, getClientById };
  return (
    <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>
  );
}

export { ClientsContext, ClientsProvider };
