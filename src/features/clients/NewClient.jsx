import { useState } from "react";
import { useClients } from "./useClients";
import { useAuth } from "../auth/useAuth";

export default function NewClient() {
  const { addClient } = useClients();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const { user } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Le nom est requis";
    if (!email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "L'email n'est pas valide";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    await addClient({
      id: crypto.randomUUID(),
      userId: user.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    });
    setName("");
    setEmail("");
    setPhone("");
    setErrors({});
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-sm font-semibold text-gray-900">
        Nouveau client
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((p) => ({ ...p, name: "" }));
            }}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm placeholder-gray-400 transition focus:ring-2 focus:ring-gray-900 focus:outline-none ${
              errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.name && (
            <p className="mt-1 ml-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((p) => ({ ...p, email: "" }));
            }}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm placeholder-gray-400 transition focus:ring-2 focus:ring-gray-900 focus:outline-none ${
              errors.email ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.email && (
            <p className="mt-1 ml-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm placeholder-gray-400 transition focus:ring-2 focus:ring-gray-900 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-1 w-full rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
