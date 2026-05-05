# 🍕 Pizza Tracker - React Frontend

Este es el cliente interactivo y en tiempo real para el sistema de gestión de órdenes **Pizza Tracker**. Desarrollado con **React y Vite**, este frontend consume una API RESTful construida en Go, utilizando **Server-Sent Events (SSE)** para ofrecer actualizaciones instantáneas del estado de las órdenes sin necesidad de recargar la página o hacer polling excesivo.

> 🔗 **Repositorio del Backend:** La lógica de negocio, concurrencia y base de datos de este proyecto se encuentran en un repositorio separado. Puedes ver el código del servidor aquí: [diazjohan98/pizza-tracker-backend](https://github.com/diazjohan98/pizza-tracker-backend).

---

## 🚀 Características Principales

- 📡 **Conexión en Tiempo Real (SSE):** Integración nativa con `EventSource` para reaccionar a los eventos emitidos por el servidor Go de manera asíncrona.
- 👨‍🍳 **Panel de Administración Protegido:** Rutas privadas protegidas por autenticación basada en cookies (`credentials: "include"`) y manejo de CORS inter-contenedores.
- 🍕 **Order Tracker Animado (Vista Cliente):** Barra de progreso interactiva y responsiva que muestra el estado exacto de la orden usando animaciones fluidas.
- 🎨 **Diseño Moderno (Glassmorphism):** Interfaces atractivas y limpias estructuradas íntegramente con clases utilitarias de Tailwind CSS v4.

---

## 💻 Stack Tecnológico

- **Framework:** React 18
- **Build Tool:** Vite (Rendimiento y empaquetado ultrarrápido)
- **Estilos:** Tailwind CSS v4 (Motor nativo)
- **Enrutamiento:** React Router DOM
- **Animaciones:** GSAP (GreenSock) para transiciones dinámicas en el estado de las órdenes.
- **Integración API:** Fetch API nativa configurada para sesiones multiplataforma.

---

## ⚙️ Instalación y Uso Local

Si deseas correr únicamente el entorno de desarrollo del frontend de manera aislada:

1. **Clonar el repositorio:**
   ```
   bash
   git clone [https://github.com/diazjohan98/pizza-tracker-frontend.git](https://github.com/diazjohan98/pizza-tracker-frontend.git)
   cd pizza-tracker-frontend
   ```

```
2.  Instalar dependencias:
```

Bash
npm install

```
3. Ejecutar el servidor de desarrollo:
```

Bash
npm run dev

```
(La aplicación estará disponible en http://localhost:5173 o el puerto que asigne Vite)

🐳 Nota sobre Docker: Para desplegar el proyecto completo (Frontend + Backend) utilizando docker-compose, por favor dirígete al repositorio del Backend y sigue las instrucciones de la arquitectura unificada.

```

👨‍💻 Autor
Johan Sebastian Vasquez Diaz

Ingeniero en Sistemas | Frontend (React, Vue, TS) | Go enthusiast

```

Aplicando principios de Clean Architecture y escalabilidad tanto en el cliente como en el servidor.
```
