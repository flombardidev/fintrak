import { createContext, useCallback } from "react";
import { useFetch } from "../../hooks/useFetch";

const ClientsContext = createContext();

function ClientsProvider({ children }) {
  const { data: clients, loading, error, post, refetch } = useFetch("/clients");//sumar put para update

  const addClient = useCallback(
    async (client) => {
      await post(client);
    },
    [post],
  );

  const getClientById = useCallback(
    (id) => {
      return clients.find((c) => c.id === id);
    },
    [clients],
  );

  const value = {
    clients,
    loading,
    error,
    addClient,
    getClientById,
    refetch,
  };

  return (
    <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>
  );
}

export { ClientsContext, ClientsProvider };
