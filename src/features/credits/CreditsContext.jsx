import { createContext, useCallback } from "react";
import { useFetch } from "../../hooks/useFetch";

const CreditsContext = createContext();

function CreditsProvider({ children }) {
  const { data: credits, loading, error, post, put, refetch } = useFetch("/credits");

  const addCredit = useCallback(async (credit) => {
    await post(credit);
  }, [post]);

  const getCreditByCreditId = useCallback((id) => {
    return credits.find(c => c.id === id);
  }, [credits]);

  const getCreditsByClientId = useCallback((clientId) => {
    return credits.filter(c => c.clientId === clientId);
  }, [credits]);

  const updateCredit = useCallback(async (id, updatedCredit) => {
    await put(id, updatedCredit);
  }, [put]);

  const value = {
    credits,
    loading,
    error,
    addCredit,
    getCreditByCreditId,
    getCreditsByClientId,
    updateCredit,
    refetch,
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
}

export { CreditsContext, CreditsProvider };