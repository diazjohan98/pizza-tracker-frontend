import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Customer() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/orders/${orderId}`,
        );

        if (!response.ok) throw new Error("No pudimos encontrar tu orden");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

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
          src="/src/assets/pngtree-full-pizza-illustration-png-image_19451292.png"
          className="w-24 h-24 animate-spin-slow mb-4"
          alt="Cargando"
        />
        <p className="text-orange-600 font-medium animate-pulse">
          Buscando tu pizza...
        </p>
      </div>
    );

  // Pantalla de Error
  if (error)
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-rose-100">
          <h1 className="text-2xl font-bold text-rose-600 mb-2">¡Ups! 🍕</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-xl"
          >
            Reintentar
          </button>
        </div>
      </div>
    );

  const { order, statuses } = data;
  const currentIndex = statuses.indexOf(order.status);

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 min-h-screen flex flex-col items-center p-6 md:p-8">
      <img
        src="/src/assets/pngtree-full-pizza-illustration-png-image_19451292.png"
        className="w-40 h-40 mb-10 animate-spin-slow drop-shadow-lg"
        alt="Pizza"
      />

      <div className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20 max-w-3xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 text-center tracking-tight">
          Track Your Pizza Order
        </h1>
        <div className="text-lg text-gray-500 mb-10 text-center font-medium">
          Order #{order.id}
        </div>

        {/* Barra de Progreso Dinámica */}
        <div className="relative flex justify-between items-center mb-4">
          <div className="absolute inset-x-[30px] h-1.5 bg-gray-200 top-1/2 -translate-y-1/2 rounded-full">
            {/* Línea Verde Dinámica */}
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{
                width: `${(currentIndex / (statuses.length - 1)) * 100}%`,
              }}
            ></div>
          </div>

          {statuses.map((status, index) => (
            <div
              key={status}
              className="flex-1 flex justify-center relative mx-2"
            >
              <div
                className={`size-14 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 z-10 shadow-md ${
                  index <= currentIndex
                    ? "bg-emerald-500 scale-110"
                    : "bg-gray-300"
                }`}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Nombres de los estados */}
        <div className="flex justify-between text-xs md:text-sm text-gray-700 mb-10 font-semibold">
          {statuses.map((s) => (
            <span key={s} className="flex-1 text-center mx-1">
              {s}
            </span>
          ))}
        </div>

        {/* Detalles del Cliente */}
        <div className="bg-gray-50/60 p-6 rounded-2xl border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Detalles del Envío
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p>
              <span className="text-gray-500">Nombre:</span>{" "}
              {order.customerName}
            </p>
            <p>
              <span className="text-gray-500">Teléfono:</span> {order.phone}
            </p>
            <p className="md:col-span-2">
              <span className="text-gray-500">Dirección:</span> {order.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
