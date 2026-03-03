import { useCredits } from "./useCredits";
import CreditItem from "./CreditItem";

function CreditList() {
  const { credits } = useCredits();

  if (credits.length === 0) {
    return <p>No credits created yet.</p>;
  }

  return (
    <div className="space-y-4">
      {credits.map((credit) => (
        <CreditItem key={credit.id} credit={credit} />
      ))}
    </div>
  );
}

export default CreditList;
