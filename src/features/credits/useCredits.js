import { useContext } from "react";
import { CreditsContext } from "./CreditsContext";

export function useCredits() {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
}
