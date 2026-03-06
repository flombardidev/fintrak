import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalide";
    if (!password.trim()) newErrors.password = "Le mot de passe est requis";
    else if (password.length < 4) newErrors.password = "Minimum 4 caractères";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegister
        ? "http://localhost:3001/register"
        : "http://localhost:3001/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setErrors({
          general: isRegister
            ? "Cet email est déjà utilisé"
            : "Email ou mot de passe incorrect",
        });
        return;
      }
      const data = await res.json();
      login(data.user, data.accessToken);
      navigate("/dashboard");
    } catch {
      setErrors({ general: "Erreur de connexion au serveur" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F3] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight text-gray-900">
            Fintrak
          </span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-lg font-semibold text-gray-900">
            {isRegister ? "Créer un compte" : "Connexion"}
          </h1>
          <p className="mb-6 text-sm text-gray-400">
            {isRegister ? "Rejoignez Fintrak" : "Bienvenue sur Fintrak"}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errors.general && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs text-red-600">{errors.general}</p>
              </div>
            )}

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
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: "" }));
                }}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm placeholder-gray-400 transition focus:ring-2 focus:ring-gray-900 focus:outline-none ${
                  errors.password
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200"
                }`}
              />
              {errors.password && (
                <p className="mt-1 ml-1 text-xs text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
            >
              {loading
                ? "Chargement..."
                : isRegister
                  ? "Créer un compte"
                  : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            {isRegister ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
            <button
              onClick={() => {
                setIsRegister((p) => !p);
                setErrors({});
              }}
              className="font-medium text-gray-900 hover:underline"
            >
              {isRegister ? "Se connecter" : "S'inscrire"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
