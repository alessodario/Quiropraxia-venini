"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const originalImages = [
  "/hero.jpg",
  "/slider1.jpg",
  "/slider2.jpg",
  "/slider3.jpg",
  "/slider4.jpg",
  "/slider5.jpg",
  "/slider6.jpg",
  "/slider7.jpg",
  "/slider8.png",
  "/alivio.jpg",
];

// Agregamos la primera imagen al final para lograr el efecto infinito sin rebobinado
const images = [...originalImages, originalImages[0]];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Si estamos en la última imagen (la copia de la primera), saltamos rápido a la primera real
    if (currentIndex === images.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false); // Desactivamos la transición
        setCurrentIndex(0); // Saltamos al inicio
      }, 1000); // 1000ms es el tiempo que dura la transición CSS
    }
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Avanzamos a la siguiente imagen, activando la transición
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        height: "80vh",
        minHeight: "600px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          width: `${images.length * 100}%`,
          transform: `translateX(-${(currentIndex * 100) / images.length}%)`,
          transition: isTransitioning ? "transform 1s ease-in-out" : "none",
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              height: "100%",
              width: `${100 / images.length}%`,
            }}
          >
            <Image
              src={src}
              alt={`Consultorio Quiropráctico ${index + 1}`}
              fill
              style={{ objectFit: "cover", filter: "brightness(0.7)" }}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 10,
        }}
      >
        {originalImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentIndex(index);
            }}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              border: "none",
              backgroundColor:
                (currentIndex === originalImages.length ? 0 : currentIndex) === index
                  ? "white"
                  : "rgba(255, 255, 255, 0.5)",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
