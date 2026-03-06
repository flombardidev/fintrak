import { Link } from "react-router-dom";

const AVATAR_COLORS = [
  "#6366F1",
  "#F59E0B",
  "#10B981",
  "#EC4899",
  "#8B5CF6",
  "#3B82F6",
  "#EF4444",
  "#14B8A6",
];
function avatarColor(name) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}
function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ClientItem({ client }) {
  return (
    <tr className="border-t border-gray-50 transition hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: avatarColor(client.name),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {initials(client.name)}
          </div>
          <span className="text-sm font-medium text-gray-900">
            {client.name}
          </span>
        </div>
      </td>
      <td className="hidden px-6 py-4 text-sm text-gray-400 sm:table-cell">
        {client.email}
      </td>
      <td className="hidden px-6 py-4 text-sm text-gray-400 sm:table-cell">
        {client.phone || "—"}
      </td>
      <td className="px-3 py-4 text-right sm:px-6">
        <Link
          to={`/clients/${client.id}`}
          className="text-xs font-medium text-gray-500 transition hover:text-gray-900"
        >
          Voir →
        </Link>
      </td>
    </tr>
  );
}
