import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import miPizzaImg from "../assets/pngtree-full-pizza-illustration-png-image_19451292.png";

export default function Customer() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Fetch inicial
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/orders/${orderId}`,
        );

        if (!response.ok) throw new Error("No pudimos encontrar tu orden");

        const result = await response.json();
        console.log("resultados:", result);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // 2. Conexión SSE para tiempo real
    const eventSource = new EventSource(
      `http://localhost:8080/notifications?orderID=${orderId}`,
    );

    eventSource.onmessage = () => {
      fetchOrder();
    };

    return () => eventSource.close();
  }, [orderId]);

  // Pantalla de Carga
  if (loading)
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center">
        <img
          src="/static/pizza-img.png"
          className="w-24 h-24 animate-bounce mb-4 drop-shadow-md"
          alt="Cargando"
        />
        <p className="text-orange-600 font-medium animate-pulse">
          Cargando tu orden...
        </p>
      </div>
    );

  // Pantalla de Error
  if (error)
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-rose-100 max-w-sm w-full">
          <h1 className="text-3xl font-bold text-rose-600 mb-4">¡Ups! 🍕</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-rose-500 hover:bg-rose-600 transition-colors text-white font-bold rounded-xl"
          >
            Reintentar
          </button>
        </div>
      </div>
    );

  // Extraemos datos asegurando compatibilidad con los nombres del JSON de Go
  const { order, statuses } = data;
  const currentStatus = order.Status || order.status;
  const currentIndex = statuses.indexOf(currentStatus);
  const items = order.pizzas || order.Pizzas || [];

  return (
    <div className="bg-gradient-to-br from-[#fdf7f0] to-[#fdf0f0] min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 md:px-8 font-sans text-gray-800">
      <img
        src={miPizzaImg}
        className="w-28 h-28 mb-6 drop-shadow-lg animate-bounce"
        alt="Pizza"
      />

      {/* Contenedor Principal Blanca */}
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 max-w-3xl w-full">
        {/* Cabecera */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-[#1a202c] text-center tracking-tight">
          Track Your Pizza Order
        </h1>
        <p className="text-gray-500 mb-12 text-center font-medium text-lg">
          Order #{order.ID || order.id}
        </p>

        {/* Barra de Progreso (Idéntica a tu diseño) */}
        <div className="relative flex justify-between items-center mb-12 max-w-2xl mx-auto">
          {/* Línea de fondo */}
          <div className="absolute inset-x-[10%] h-1 bg-gray-200 top-6 -translate-y-1/2 z-0">
            {/* Línea Verde Dinámica */}
            <div
              className="h-full bg-[#10b981] transition-all duration-500"
              style={{
                width: `${(currentIndex / (statuses.length - 1)) * 100}%`,
              }}
            ></div>
          </div>

          {statuses.map((status, index) => {
            const isActive = index <= currentIndex;
            return (
              <div
                key={status}
                className="flex flex-col items-center z-10 w-20"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-3 transition-all duration-500 ${
                    isActive
                      ? "bg-[#10b981] shadow-md scale-110"
                      : "bg-[#cbd5e1]"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs font-semibold text-center text-gray-600 leading-tight">
                  {status}
                </span>
              </div>
            );
          })}
        </div>

        {/* SECCIÓN 1: Order Details */}
        <div className="bg-[#f8fafc] rounded-2xl p-6 md:p-8 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-[#1e293b] mb-6">
            Order Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Customer Name
              </p>
              <p className="font-semibold text-gray-900">
                {order.CustomerName || order.customerName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
              <p className="font-semibold text-gray-900">
                {order.Phone || order.phone}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
              <p className="font-semibold text-gray-900">
                {order.Address || order.address}
              </p>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: Pizzas */}
        <div className="bg-[#f8fafc] rounded-2xl p-6 md:p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-[#1e293b] mb-6">Pizzas</h2>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
              >
                <h3 className="font-bold text-[#1e293b] mb-4">
                  Pizza #{index + 1}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Type
                    </p>
                    <p className="font-semibold text-gray-900">
                      {item.Pizza || item.pizza}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Size
                    </p>
                    <p className="font-semibold text-gray-900">
                      {item.Size || item.size}
                    </p>
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Special Instructions
                    </p>
                    <p className="font-semibold text-gray-900">
                      {item.Instructions || item.instructions || "None"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
