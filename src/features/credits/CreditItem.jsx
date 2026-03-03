import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/format";
function CreditItem({ credit }) {
  return (
    <li className="flex items-center justify-between rounded border bg-amber-100 p-4">
      <div>
        <p className="font-semibold">{formatCurrency(credit.principal)}</p>
        <p className="text-sm text-gray-500">
          {credit.annualRate}% - {credit.months} months
        </p>
      </div>

      <Link to={`/credits/${credit.id}`} className="text-blue-600">
        View
      </Link>
    </li>
  );
}

export default CreditItem;
