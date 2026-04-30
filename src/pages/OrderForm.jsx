import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import AnimatedPizzaLayout from "../components/AnimatedPizzaLayout";
export default function OrderForm() {
  const navigate = useNavigate();

  const pizzaRef = useRef(null);
  const containerRef = useRef(null);

  const [options, setOptions] = useState({ types: [], sizes: [] });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [pizzas, setPizzas] = useState([
    { size: "", type: "", instructions: "" },
  ]);

  useEffect(() => {
    fetch("http://localhost:8080/api/form-data")
      .then((res) => res.json())
      .then((data) => {
        const fetchedTypes = data.pizzaTypes || [];
        const fetchedSizes = data.pizzaSizes || [];
        setOptions({ types: fetchedTypes, sizes: fetchedSizes });

        if (fetchedTypes.length > 0 && fetchedSizes.length > 0) {
          setPizzas([
            { size: fetchedSizes[0], type: fetchedTypes[0], instructions: "" },
          ]);
        }
      })
      .catch(() => setError("No pudimos cargar el menú."))
      .finally(() => setLoading(false));
  }, []);

  const handleCustomerChange = (e) =>
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  const handlePizzaChange = (index, field, value) => {
    const newPizzas = [...pizzas];
    newPizzas[index][field] = value;
    setPizzas(newPizzas);
  };
  const addPizza = () =>
    setPizzas([
      ...pizzas,
      { size: options.sizes[0], type: options.types[0], instructions: "" },
    ]);
  const removePizza = (indexToRemove) => {
    if (pizzas.length > 1)
      setPizzas(pizzas.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      size: pizzas.map((p) => p.size),
      pizza_types: pizzas.map((p) => p.type),
      instructions: pizzas.map((p) => p.instructions),
    };

    try {
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Error al crear la orden");

      gsap.to(containerRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power2.in",
      });

      pizzaRef.current.playZoom(() => {
        navigate(`/customer/${result.orderId}`);
      });
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Cargando menú...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-10 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center overflow-hidden">
      <AnimatedPizzaLayout ref={pizzaRef} className="mb-6" />

      <div
        ref={containerRef}
        className="max-w-2xl w-full mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50 z-10 relative"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 tracking-tight">
          Pide tu Pizza 🍕
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/60 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Información del cliente
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre:
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={customer.name}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefono:
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección:
                </label>
                <input
                  required
                  type="text"
                  name="address"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none bg-white/80"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-semibold text-gray-800">Pizzas</h2>
              <button
                type="button"
                onClick={addPizza}
                className="px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors shadow-sm"
              >
                + Agregar una nueva pizza
              </button>
            </div>

            <div className="space-y-6">
              {pizzas.map((pizza, index) => (
                <div
                  key={index}
                  className="p-6 border border-gray-100 rounded-2xl bg-white/80 shadow-sm relative transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      Pizza #{index + 1}
                    </h3>
                    {pizzas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePizza(index)}
                        className="text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded-lg"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tamaño:
                      </label>
                      <select
                        required
                        value={pizza.size}
                        onChange={(e) =>
                          handlePizzaChange(index, "size", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-400 outline-none"
                      >
                        {options.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de pizza:
                      </label>
                      <select
                        required
                        value={pizza.type}
                        onChange={(e) =>
                          handlePizzaChange(index, "type", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-400 outline-none"
                      >
                        {options.types.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instrucción especial
                      </label>
                      <textarea
                        rows="2"
                        value={pizza.instructions}
                        onChange={(e) =>
                          handlePizzaChange(
                            index,
                            "instructions",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none resize-none bg-white"
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full py-4 px-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-70 transform hover:-translate-y-1"
          >
            {isSubmitting ? "Procesando el pedido..." : "Enviar pedido"}
          </button>
        </form>
      </div>
    </div>
  );
}
