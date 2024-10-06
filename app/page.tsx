"use client";
import { useState, useEffect } from "react";

const GRID_SIZE = 5; // 5x5 grid
const MAX_HEARTS = 16;
const CENTER_EXCLUSION = 1; // Tamaño del área central a excluir (en cada dirección)

type Heart = {
  id: number;
  x: number;
  y: number;
};

export default function Component() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [occupiedPositions, setOccupiedPositions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prevHearts) => {
        const newHearts = [...prevHearts];

        if (newHearts.length >= MAX_HEARTS) {
          const oldestHeart = newHearts.shift();
          if (oldestHeart) {
            setOccupiedPositions((prev) => {
              const newSet = new Set(prev);
              newSet.delete(`${oldestHeart.x},${oldestHeart.y}`);
              return newSet;
            });
          }
        }

        for (let attempts = 0; attempts < 20; attempts++) {
          const x = Math.floor(Math.random() * GRID_SIZE);
          const y = Math.floor(Math.random() * GRID_SIZE);
          const posKey = `${x},${y}`;

          // Evitar el área central
          if (
            Math.abs(x - Math.floor(GRID_SIZE / 2)) <= CENTER_EXCLUSION &&
            Math.abs(y - Math.floor(GRID_SIZE / 2)) <= CENTER_EXCLUSION
          ) {
            continue;
          }

          if (!occupiedPositions.has(posKey)) {
            newHearts.push({ id: Date.now(), x, y });
            setOccupiedPositions((prev) => new Set(prev).add(posKey));
            break;
          }
        }

        return newHearts;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [occupiedPositions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl aspect-square">
        {hearts.map((heart) => (
          <Heart key={heart.id} x={heart.x} y={heart.y} />
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-red-600 mb-4">
            Te Amo Mamá
          </h1>
          <p className="text-xl md:text-2xl text-red-500 max-w-md">
            Gracias por todo tu amor y cariño. Eres la mejor mamá del mundo.
          </p>
        </div>
      </div>
    </div>
  );
}

function Heart({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute w-1/5 h-1/5 flex items-center justify-center"
      style={{
        left: `${(x / GRID_SIZE) * 100}%`,
        top: `${(y / GRID_SIZE) * 100}%`,
      }}
    >
      <svg
        className="w-full h-full text-red-500 animate-fadeInOut"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
}
