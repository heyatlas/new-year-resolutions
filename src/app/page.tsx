"use client";

import { useState } from "react";
import Image from "next/image";

const CHARACTERS = [
  { id: 1, name: "GUERRERO", avatar: "/avatars/1.png", trait: "Determinado y Fuerte" },
  { id: 2, name: "MAGO", avatar: "/avatars/2.png", trait: "Sabio y Creativo" },
  { id: 3, name: "PÍCARO", avatar: "/avatars/3.png", trait: "Ágil y Adaptable" },
  { id: 4, name: "SANADOR", avatar: "/avatars/4.png", trait: "Compasivo y Paciente" },
];

const PLAYERS = [
  { name: "ALEX_84", quest: "Aprender Desarrollo de Juegos", difficulty: "EXPERTO", avatar: "/avatars/1.png" },
  { name: "SARA.K", quest: "Correr un Maratón", difficulty: "LEGENDARIO", avatar: "/avatars/2.png" },
  { name: "MIKE_22", quest: "Iniciar un Negocio", difficulty: "EXPERTO", avatar: "/avatars/3.png" },
  { name: "JESS_P", quest: "Aprender Japonés", difficulty: "INTERMEDIO", avatar: "/avatars/4.png" },
];

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

  const handleNextStep = () => {
    setFormStep(2);
  };

  const handlePrevStep = () => {
    setFormStep(1);
  };

  return (
    <>
      <div className="grid-background" />
      <div className="min-h-screen bg-transparent text-green-400 p-8 font-[family-name:var(--font-press-start)]">
        <main className="max-w-2xl mx-auto flex flex-col items-center gap-8 pt-16">
          <h1 className="text-2xl md:text-4xl text-center leading-relaxed mb-8 animate-pulse">
            ATLAS DE
            <br />
            PROPÓSITOS DE AÑO NUEVO
          </h1>

          <div className="text-sm md:text-base text-center leading-relaxed space-y-4 border-2 border-green-400 p-6 bg-black">
            <p>¡BIENVENIDO, ALMA VALIENTE!</p>
            <p>¿LISTO PARA SUBIR DE NIVEL EN ESTE AÑO NUEVO?</p>
            <p>DOCUMENTA TUS MISIONES Y SIGUE TU PROGRESO AQUÍ.</p>
          </div>

          {!showForm ? (
            <>
              <div className="w-full border-2 border-green-400 bg-black/80 p-6">
                <h2 className="text-sm mb-4 text-center">AVENTUREROS ACTIVOS</h2>
                <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-0.5">
                    {[...PLAYERS, ...PLAYERS].map((player, index) => (
                      <div 
                        key={`${player.name}-${index}`} 
                        className="flex flex-col items-center gap-2 p-2 border border-green-400/30 hover:border-green-400 transition-colors bg-black"
                      >
                        <div className="relative w-12 h-[30px] mb-2">
                          <Image
                            src={player.avatar}
                            alt={player.name}
                            fill
                            className="pixelated object-contain"
                          />
                        </div>
                        <div className="text-[10px] text-center">
                          <p className="font-bold mb-1">{player.name}</p>
                          <p className="opacity-80 mb-1">{player.quest}</p>
                          <p className="text-[8px] text-yellow-400">{player.difficulty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 border-2 border-green-400 hover:bg-green-400 hover:text-black transition-colors mt-8 text-sm md:text-base"
              >
                INICIAR TU AVENTURA
              </button>
            </>
          ) : (
            <div className="w-full">
              <div className="flex justify-center mb-8">
                <div className="flex gap-4 items-center text-xs">
                  <div className={`w-8 h-8 border-2 ${formStep === 1 ? 'bg-green-400 text-black' : ''} border-green-400 flex items-center justify-center`}>
                    1
                  </div>
                  <div className="w-12 h-0.5 bg-green-400"></div>
                  <div className={`w-8 h-8 border-2 ${formStep === 2 ? 'bg-green-400 text-black' : ''} border-green-400 flex items-center justify-center`}>
                    2
                  </div>
                </div>
              </div>

              <form className="w-full space-y-8 border-2 border-green-400 p-6 bg-black">
                {formStep === 1 ? (
                  <>
                    <div className="space-y-4">
                      <label className="block text-sm">INGRESA TU NOMBRE:</label>
                      <input
                        type="text"
                        className="w-full bg-black border-2 border-green-400 p-2 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="INGRESA TU ALIAS"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm mb-4">ELIGE TU PERSONAJE:</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {CHARACTERS.map((char) => (
                          <button
                            key={char.id}
                            type="button"
                            onClick={() => setSelectedCharacter(char.id)}
                            className={`flex flex-col items-center p-3 border-2 ${
                              selectedCharacter === char.id
                                ? 'border-green-400 bg-green-400/10'
                                : 'border-green-400/30 hover:border-green-400/60'
                            } transition-all`}
                          >
                            <div className="relative w-16 h-40 mb-2">
                              <Image
                                src={char.avatar}
                                alt={char.name}
                                fill
                                className="pixelated object-contain"
                              />
                            </div>
                            <p className="text-xs font-bold mb-1">{char.name}</p>
                            <p className="text-[10px] text-center opacity-80">{char.trait}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!selectedCharacter}
                      className="w-full px-8 py-4 border-2 border-green-400 hover:bg-green-400 hover:text-black transition-colors text-sm disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-green-400 disabled:cursor-not-allowed"
                    >
                      SIGUIENTE MISIÓN →
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <label className="block text-sm">SELECCIONA TU LÍNEA DE TIEMPO:</label>
                      <select
                        className="w-full bg-black border-2 border-green-400 p-2 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option>3 MESES</option>
                        <option>6 MESES</option>
                        <option>9 MESES</option>
                        <option>12 MESES</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm">ELIGE TUS ALIADOS (SELECCIÓN MÚLTIPLE):</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="form-checkbox border-green-400 bg-black text-green-400" />
                          <span>FAMILIA</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="form-checkbox border-green-400 bg-black text-green-400" />
                          <span>AMIGOS</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="form-checkbox border-green-400 bg-black text-green-400" />
                          <span>MENTOR</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="form-checkbox border-green-400 bg-black text-green-400" />
                          <span>MISIÓN SOLITARIA</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm">TU MOTIVACIÓN (¿POR QUÉ IMPORTA ESTA MISIÓN?):</label>
                      <textarea
                        className="w-full bg-black border-2 border-green-400 p-2 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 h-24"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="w-1/2 px-8 py-4 border-2 border-green-400 hover:bg-green-400 hover:text-black transition-colors text-sm"
                      >
                        ← ATRÁS
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 px-8 py-4 border-2 border-green-400 hover:bg-green-400 hover:text-black transition-colors text-sm"
                      >
                        ¡COMENZAR!
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
