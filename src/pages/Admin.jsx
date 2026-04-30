import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const [data, setData] = useState({ orders: [], statuses: [], username: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/dashboard",
        {
          credentials: "include",
        },
      );

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) throw new Error("Error cargando el dashboard");

      const result = await response.json();
      setData({ ...result, orders: result.orders || [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const formData = new URLSearchParams();
      formData.append("status", newStatus);

      const response = await fetch(
        `http://localhost:8080/api/admin/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
          credentials: "include",
        },
      );

      if (!response.ok) throw new Error("Error actualizando la orden");
      fetchDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar esta orden? Esta acción no se puede deshacer.",
      )
    )
      return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/orders/${orderId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) throw new Error("Error eliminando la orden");
      fetchDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔥 Helper: Colores semánticos para los estados
  const getStatusStyles = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20 focus:ring-blue-500";
      case "Preparing":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 focus:ring-yellow-500";
      case "Baking":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20 focus:ring-orange-500";
      case "Quality Check":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20 focus:ring-purple-500";
      case "Ready":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 focus:ring-emerald-500";
      default:
        return "bg-gray-800 text-gray-300 border-gray-700 focus:ring-gray-500";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-emerald-500 font-bold text-xl animate-pulse">
        Cargando el Imperio Pizzero...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#0f172a] text-red-500 flex items-center justify-center font-bold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-300 p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-[90rem] mx-auto">
        {/* Header Premium */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b border-slate-800/60 gap-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
              🍕
            </span>
            Pizza Tracker <span className="text-emerald-500">Admin</span>
          </h1>
          <div className="flex items-center gap-5 bg-slate-800/40 backdrop-blur-md py-2.5 px-5 rounded-2xl border border-slate-700/50 shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Operador
              </span>
              <span className="text-emerald-400 font-bold text-sm">
                {data.username}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <button
              onClick={async () => {
                await fetch("http://localhost:8080/api/logout", {
                  method: "POST",
                  credentials: "include",
                });
                navigate("/login");
              }}
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 p-2 rounded-lg transition-all text-sm font-bold flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Salir
            </button>
          </div>
        </header>

        {/* Contenedor de la Tabla */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
            <h2 className="text-lg font-semibold text-white flex items-center gap-3">
              Órdenes Activas
              <span className="bg-emerald-500/20 text-emerald-400 py-0.5 px-2.5 rounded-full text-xs font-bold border border-emerald-500/20">
                {data.orders.length}
              </span>
            </h2>
            <button
              onClick={fetchDashboard}
              className="text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-xl transition-all border border-slate-700 shadow-sm flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Sincronizar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-800/40 text-slate-400 text-xs uppercase tracking-widest border-b border-slate-800">
                  <th className="py-4 px-6 font-semibold w-24">ID</th>
                  <th className="py-4 px-6 font-semibold">Cliente Info</th>
                  <th className="py-4 px-6 font-semibold w-1/3">
                    Detalle del Pedido
                  </th>
                  <th className="py-4 px-6 font-semibold text-center w-48">
                    Estado
                  </th>
                  <th className="py-4 px-6 font-semibold text-center w-24">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {data.orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-12 text-center text-slate-500 font-medium"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📭</span>
                        No hay órdenes en la cola de producción.
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* ID - Centrado verticalmente */}
                      <td className="py-4 px-6 align-middle">
                        <span className="font-mono text-xs font-medium text-slate-400 bg-slate-800/50 py-1.5 px-2.5 rounded-lg border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                          #{order.id.slice(0, 6)}
                        </span>
                      </td>

                      {/* Cliente y Contacto - Agrupado para ahorrar espacio */}
                      <td className="py-4 px-6 align-middle">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-white text-base">
                            {order.customerName}
                          </span>
                          <div className="flex items-center gap-3 text-slate-400 text-xs">
                            <span className="flex items-center gap-1">
                              <span className="text-emerald-500">📞</span>{" "}
                              {order.phone}
                            </span>
                            <span className="flex items-center gap-1 truncate max-w-[200px]">
                              <span className="text-rose-500">📍</span>{" "}
                              {order.address}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Pizzas - Diseño limpio sin bordes pesados */}
                      <td className="py-4 px-6 align-middle whitespace-normal">
                        <div className="flex flex-col gap-2">
                          {order.pizzas?.map((pizza, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-500 text-xs mt-0.5">
                                ●
                              </span>
                              <div>
                                <p className="text-slate-200 font-medium leading-tight">
                                  <span className="text-slate-400 font-normal mr-1">
                                    {pizza.size}
                                  </span>
                                  {pizza.pizza}
                                </p>
                                {pizza.instructions && (
                                  <p className="text-xs text-slate-500 italic mt-0.5 border-l-2 border-slate-700 pl-2">
                                    "{pizza.instructions}"
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Select de Estado - Estilo dinámico tipo Badge */}
                      <td className="py-4 px-6 align-middle text-center">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className={`appearance-none border text-sm rounded-xl block w-full px-4 py-2 outline-none cursor-pointer text-center font-semibold tracking-wide shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${getStatusStyles(order.status)}`}
                          style={{ textAlignLast: "center" }}
                        >
                          {data.statuses.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-slate-800 text-slate-200"
                            >
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Botón Eliminar - Sutil pero claro */}
                      <td className="py-4 px-6 align-middle text-center">
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                          title="Eliminar orden"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
