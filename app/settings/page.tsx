"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

interface GymData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [gym, setGym] = useState<GymData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchGym();
  }, []);

  const fetchGym = async () => {
    try {
      const response = await fetch("/api/gyms");
      const data = await response.json();
      if (data.success) {
        setGym(data.data);
        setFormData({
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone || "",
          address: data.data.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching gym:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/gyms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setGym(data.data);
        setMessage("Configuración guardada correctamente");
      } else {
        setMessage(data.message || "Error al guardar");
      }
    } catch (error) {
      setMessage("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Configuración</h1>
            <p className="text-gray-400 text-sm">
              Ajustes de tu gimnasio
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="/members"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Miembros
            </a>
            <a
              href="/plans"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Planes
            </a>
            <a
              href="/settings"
              className="text-white bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Configuración
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gym info section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Información del gimnasio
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Nombre del gimnasio *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email de contacto *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Dirección
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg ${
                    message.includes("correctamente")
                      ? "bg-green-900/30 text-green-400 border border-green-700"
                      : "bg-red-900/30 text-red-400 border border-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Account section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Tu cuenta
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <p className="text-white font-medium">{session?.user?.name}</p>
                <p className="text-gray-400 text-sm">{session?.user?.email}</p>
              </div>
              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                {session?.user?.role}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <p className="text-gray-300">ID del gimnasio</p>
                <p className="text-gray-500 text-sm font-mono">{gym?.id}</p>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-gray-800 rounded-lg border border-red-900/50 p-6">
          <h2 className="text-xl font-semibold text-red-400 mb-4">
            Zona de peligro
          </h2>
          <p className="text-gray-400 mb-4">
            Estas acciones son irreversibles. Ten cuidado al realizar cambios en
            esta sección.
          </p>
          <button
            disabled
            className="px-4 py-2 bg-red-600/20 text-red-400/50 rounded-lg cursor-not-allowed"
          >
            Eliminar gimnasio (no disponible)
          </button>
        </div>
      </main>
    </div>
  );
}
