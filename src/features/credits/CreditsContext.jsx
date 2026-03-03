import { createContext, useState, useEffect } from "react";

const CreditsContext = createContext();

function CreditsProvider({ children }) {
  const [credits, setCredits] = useState(() => {
    const storedCredits = localStorage.getItem("credits");
    return storedCredits ? JSON.parse(storedCredits) : [];
  });
  useEffect(() => {
    localStorage.setItem("credits", JSON.stringify(credits));
  }, [credits]);

  function addCredit(newCredit) {
    setCredits((prev) => [...prev, newCredit]);
  }

  function getCreditByCreditId(id) {
    return credits.find((credit) => credit.id === id);
  }
  function getCreditsByClientId(id) {
    return credits.filter((credit) => credit.clientId === id);
  }

  function updateCredit(id, updatedCredit) {
    setCredits((prev) =>
      prev.map((credit) => (credit.id === id ? updatedCredit : credit)),
    );
  }

  const value = {
    credits,
    addCredit,
    getCreditByCreditId,
    getCreditsByClientId,
    updateCredit,
  };

  return (
    <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>
  );
}

export { CreditsContext, CreditsProvider };
