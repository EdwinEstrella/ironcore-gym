"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Datos del gimnasio
  const [gymName, setGymName] = useState("");
  const [gymEmail, setGymEmail] = useState("");
  const [gymPhone, setGymPhone] = useState("");
  const [gymAddress, setGymAddress] = useState("");

  // Datos del usuario
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (userPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gymName,
          gymEmail,
          gymPhone,
          gymAddress,
          userName,
          userEmail,
          userPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/login?registered=true");
      } else {
        setError(data.message || "Error al registrar");
      }
    } catch (err) {
      setError("Error al registrar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">IronCore Gym</h1>
            <p className="text-gray-400 mt-2">Registra tu gimnasio</p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span
                className={`text-sm ${
                  step >= 1 ? "text-blue-400" : "text-gray-500"
                }`}
              >
                Paso 1: Gimnasio
              </span>
              <span
                className={`text-sm ${
                  step >= 2 ? "text-blue-400" : "text-gray-500"
                }`}
              >
                Paso 2: Cuenta
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="gymName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Nombre del gimnasio *
                  </label>
                  <input
                    id="gymName"
                    type="text"
                    value={gymName}
                    onChange={(e) => setGymName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mi Gimnasio"
                  />
                </div>

                <div>
                  <label
                    htmlFor="gymEmail"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email del gimnasio *
                  </label>
                  <input
                    id="gymEmail"
                    type="email"
                    value={gymEmail}
                    onChange={(e) => setGymEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="gimnasio@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="gymPhone"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Teléfono
                  </label>
                  <input
                    id="gymPhone"
                    type="tel"
                    value={gymPhone}
                    onChange={(e) => setGymPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="gymAddress"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Dirección
                  </label>
                  <input
                    id="gymAddress"
                    type="text"
                    value={gymAddress}
                    onChange={(e) => setGymAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Calle Principal 123"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!gymName || !gymEmail}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Siguiente
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Tu nombre completo *
                  </label>
                  <input
                    id="userName"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label
                    htmlFor="userEmail"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Tu email *
                  </label>
                  <input
                    id="userEmail"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="juan@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="userPassword"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Contraseña *
                  </label>
                  <input
                    id="userPassword"
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Confirmar contraseña *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Repite tu contraseña"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !userName || !userEmail || !userPassword}
                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    {loading ? "Registrando..." : "Crear cuenta"}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿Ya tienes cuenta?{" "}
              <a
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
