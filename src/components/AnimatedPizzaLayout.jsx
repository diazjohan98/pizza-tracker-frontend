import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import miPizzaImg from "../assets/pngtree-full-pizza-illustration-png-image_19451292.png";

const AnimatedPizzaLayout = forwardRef(({ className }, ref) => {
  const imgRef = useRef(null);

  // Exponemos la función del zoom para que cualquier vista pueda usarla
  useImperativeHandle(ref, () => ({
    playZoom: (onCompleteCallback) => {
      // 1. Detenemos el rebote de Tailwind
      if (imgRef.current) {
        imgRef.current.classList.remove("animate-bounce");

        // 2. Ejecutamos el zoom gigante de GSAP
        gsap.to(imgRef.current, {
          scale: 30, // Crece 30 veces
          rotation: 90, // Da un giro
          duration: 1, // Tarda 1 segundo
          ease: "power2.inOut",
          onComplete: onCompleteCallback, // Avisa cuando termine
        });
      }
    },
  }));

  return (
    <img
      ref={imgRef}
      src={miPizzaImg}
      // Combinamos las clases base con las que le pases desde afuera
      className={`w-28 h-28 drop-shadow-lg animate-bounce z-50 relative origin-center ${className || ""}`}
      alt="Pizza Animada"
    />
  );
});

export default AnimatedPizzaLayout;
