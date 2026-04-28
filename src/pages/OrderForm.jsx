import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderForm() {
  const navigate = useNavigate();
  const [options, setOptions] = useState({ types: [], sizes: [] });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // El estado del formulario. Nota que las pizzas van en arreglos [ ] para que Go las entienda
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    pizza_types: [""],
    size: [""],
    instructions: [""],
  });

  // 1. Cargar las opciones (Tipos de Pizza y Tamaños) desde Go al entrar
  useEffect(() => {
    fetch("http://localhost:8080/api/form-data")
      .then((res) => res.json())
      .then((data) => {
        setOptions({ types: data.pizzaTypes, sizes: data.pizzaSizes });
        // Seteamos los valores por defecto del select
        setFormData((prev) => ({
          ...prev,
          pizza_types: [data.pizzaTypes[0]],
          size: [data.pizzaSizes[0]],
        }));
      })
      .catch((err) => setError("Error conectando con la pizzería"))
      .finally(() => setLoading(false));
  }, []);

  // 2. Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si es un campo de la pizza, lo guardamos como arreglo [value]
    if (["pizza_types", "size", "instructions"].includes(name)) {
      setFormData({ ...formData, [name]: [value] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 3. Enviar el formulario a Go
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Mandamos el JSON limpio a Go
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.error || "Error al crear la orden");

      // ¡Magia! Go nos devuelve el ID y React Router nos cambia de página sin recargar
      navigate(`/customer/${result.orderId}`);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        Cargando el menú...
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 min-h-screen flex flex-col items-center p-6 md:p-8">
      <img
        src="/src/assets/pngtree-full-pizza-illustration-png-image_19451292.png"
        className="w-32 h-32 mb-6 drop-shadow-lg animate-bounce"
        alt="Pizza"
      />

      <div className="bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20 max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center tracking-tight">
          Pide tu Pizza 🍕
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y -5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefono
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección de entrega
            </label>
            <input
              required
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <hr className="border-gray-100 my-6" />

          <div className=""></div>
        </form>
      </div>
    </div>
  );
}
