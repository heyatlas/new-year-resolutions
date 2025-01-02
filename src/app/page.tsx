"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const CHARACTERS = [
  { id: 1, name: "GUERRERO", avatar: "/avatars/1.png", trait: "Determinado y Fuerte" },
  { id: 2, name: "MAGA", avatar: "/avatars/2.png", trait: "Sabia y Creativa" },
  { id: 3, name: "HECHICERA", avatar: "/avatars/3.png", trait: "Ágil y Adaptable" },
  { id: 4, name: "SANADOR", avatar: "/avatars/4.png", trait: "Compasivo y Paciente" },
];

interface FormData {
  name: string;
  character: number | null;
  resolutions: {
    first: string;
    second: string;
    third: string;
  };
  requirements: string;
  firstStep: string;
  helpers: string[];
  startDate: string;
}

interface Participant {
  id: number;
  name: string;
  character: number;
  createdAt: string;
}

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    character: null,
    resolutions: {
      first: "",
      second: "",
      third: "",
    },
    requirements: "",
    firstStep: "",
    helpers: [],
    startDate: "ESTA SEMANA"
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch('/api/resolutions');
        if (!response.ok) {
          throw new Error('Failed to fetch participants');
        }
        const data = await response.json();
        setParticipants(data);
      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setIsLoadingParticipants(false);
      }
    };

    fetchParticipants();
  }, [showForm]); // Refetch when form is closed (new submission)

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = "INGRESA TU NOMBRE";
        }
        if (!selectedCharacter) {
          newErrors.character = "ELIGE UN PERSONAJE";
        }
        break;
      case 2:
        if (!formData.resolutions.first.trim()) {
          newErrors.first = "INGRESA TU PRIMER PROPÓSITO";
        }
        if (!formData.resolutions.second.trim()) {
          newErrors.second = "INGRESA TU SEGUNDO PROPÓSITO";
        }
        if (!formData.resolutions.third.trim()) {
          newErrors.third = "INGRESA TU TERCER PROPÓSITO";
        }
        break;
      case 3:
        if (!formData.requirements.trim()) {
          newErrors.requirements = "COMPLETA ESTE CAMPO";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setFormStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3)) {
      try {
        setIsSubmitting(true);
        const response = await fetch('/api/resolutions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to save resolution');
        }

        console.log('Form submitted with data:', formData);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setShowForm(false);
          setFormStep(1);
          setSelectedCharacter(null);
          setFormData({
            name: "",
            character: null,
            resolutions: { first: "", second: "", third: "" },
            requirements: "",
            firstStep: "",
            helpers: [],
            startDate: "ESTA SEMANA"
          });
        }, 5000);
      } catch (error) {
        console.error('Error saving resolution:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderFormStep = () => {
    console.log('Rendering form step:', formStep);
    switch (formStep) {
      case 1:
        console.log('Rendering step 1');
        return (
          <div className="form-step-enter">
            <div className="space-y-4">
              <div>
                <label className="block text-sm">INGRESA TU NOMBRE:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-black border-2 ${
                    errors.name ? 'border-red-500' : 'border-green-400'
                  } p-2 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400`}
                  placeholder="NEO"
                />
                {errors.name && (
                  <p className="error-message error-shake">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-4">ELIGE TU PERSONAJE:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CHARACTERS.map((char) => (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => {
                        setSelectedCharacter(char.id);
                        setFormData({ ...formData, character: char.id });
                      }}
                      className={`flex flex-col items-center p-3 border-2 ${
                        selectedCharacter === char.id
                          ? 'border-green-400 bg-green-400/10'
                          : errors.character 
                            ? 'border-red-500/30 hover:border-red-500/60'
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
                {errors.character && (
                  <p className="error-message error-shake mt-2 text-center">{errors.character}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={!selectedCharacter}
                className="w-full px-8 py-4 border-2 border-green-400 hover:bg-green-400 hover:text-black transition-colors text-sm disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-green-400 disabled:cursor-not-allowed"
              >
                SIGUIENTE MISIÓN →
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-step-enter">
            <div className="space-y-4">
              <label className="block text-sm">¿QUÉ TE GUSTARÍA LOGRAR EN 2025 EN ATLAS?</label>
              <p className="text-[10px] mb-4 opacity-80">INGRESA 3 PROPÓSITOS PARA ESTE AÑO</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs mb-2 opacity-80">OBJETIVO #1:</label>
                  <textarea
                    value={formData.resolutions.first}
                    onChange={(e) => setFormData({
                      ...formData,
                      resolutions: { ...formData.resolutions, first: e.target.value }
                    })}
                    className={`w-full bg-black border-2 ${
                      errors.first ? 'border-red-500' : 'border-green-400'
                    } p-2 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 h-24`}
                    placeholder="ESCRIBE TU PRIMER OBJETIVO ACÁ..."
                  />
                  {errors.first && (
                    <p className="error-message error-shake">{errors.first}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs mb-2 opacity-80">OBJETIVO #2:</label>
                  <textarea
                    value={formData.resolutions.second}
                    onChange={(e) => setFormData({
                      ...formData,
                      resolutions: { ...formData.resolutions, second: e.target.value }
                    })}
                    className={`w-full bg-black border-2 ${
                      errors.second ? 'border-red-500' : 'border-green-400'
                    } p-2 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 h-24`}
                    placeholder="ESCRIBE TU SEGUNDO OBJETIVO ACÁ..."
                  />
                  {errors.second && (
                    <p className="error-message error-shake">{errors.second}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs mb-2 opacity-80">OBJETIVO #3:</label>
                  <textarea
                    value={formData.resolutions.third}
                    onChange={(e) => setFormData({
                      ...formData,
                      resolutions: { ...formData.resolutions, third: e.target.value }
                    })}
                    className={`w-full bg-black border-2 ${
                      errors.third ? 'border-red-500' : 'border-green-400'
                    } p-2 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 h-24`}
                    placeholder="ESCRIBE TU TERCER OBJETIVO ACÁ..."
                  />
                  {errors.third && (
                    <p className="error-message error-shake">{errors.third}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-1/2 px-8 py-4 border-2 border-green-400 hover:bg-green-400 hover:text-black transition-colors text-sm"
              >
                ← ATRÁS
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="w-1/2 px-8 py-4 border-2 border-green-400 hover:bg-green-400 hover:text-black transition-colors text-sm"
              >
                SIGUIENTE →
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-step-enter">
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-4">¿QUÉ TE GUSTARÍA QUE ATLAS LOGRE EN 2025?</label>
                <p className="text-[10px] mb-4 opacity-80">PUEDE SER CUALQUIER COSA VINCULADA O NO CON TU TRBAAJO</p>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className={`w-full bg-black border-2 ${
                    errors.requirements ? 'border-red-500' : 'border-green-400'
                  } p-2 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 h-40`}
                  placeholder="ME GUSTARÍA QUE..."
                  disabled={isSubmitting}
                />
                {errors.requirements && (
                  <p className="error-message error-shake">{errors.requirements}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-1/2 px-8 py-4 border-2 border-green-400 hover:bg-green-400 hover:text-black transition-colors text-sm"
                disabled={isSubmitting}
              >
                ← ATRÁS
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-1/2 px-8 py-4 border-2 border-green-400 transition-colors text-sm
                  ${isSubmitting 
                    ? 'loading-pulse cursor-wait opacity-80' 
                    : 'hover:bg-green-400 hover:text-black'}`}
              >
                {isSubmitting ? 'GUARDANDO...' : '¡FINALIZAR!'}
              </button>
            </div>
          </div>
        );
      default:
        console.log('No matching step found');
        return null;
    }
  };

  const SuccessMessage = () => (
    <div className="form-step-enter fixed inset-0 flex items-center justify-center bg-black/90 z-50 font-[family-name:var(--font-press-start)] text-green-400">
      <div className="max-w-lg p-8 border-2 border-green-400 bg-black text-center space-y-6">
        <h2 className="text-xl md:text-2xl animate-pulse">¡GRACIAS POR PARTICIPAR!</h2>
        <div className="space-y-4 text-sm">
          <p>TUS RESPUESTAS HAN SIDO GUARDADAS</p>
          <p>ESPERAMOS QUE TENGAS UN EXCELENTE 2025</p>
          <p className="text-xs opacity-70 mt-4">VOLVIENDO AL INICIO EN 5 SEGUNDOS...</p>
        </div>
        <div className="relative w-24 h-40 mx-auto">
          <Image
            src={selectedCharacter ? `/avatars/${selectedCharacter}.png` : "/avatars/1.png"}
            alt="Character"
            fill
            className="pixelated object-contain"
          />
        </div>
      </div>
    </div>
  );

  console.log('Current form state:', { showForm, formStep, selectedCharacter });

  return (
    <>
      <div className="grid-background" />
      {showSuccessMessage && <SuccessMessage />}
      <div className="min-h-screen bg-transparent text-green-400 p-8 font-[family-name:var(--font-press-start)]">
        <main className="max-w-2xl mx-auto flex flex-col items-center gap-8 pt-16">
          <h1 className="text-2xl md:text-4xl text-center leading-relaxed mb-8 animate-pulse">
            NEW YEAR ATLAS RESOLUTIONS
          </h1>

          <div className="text-sm md:text-base text-center leading-relaxed space-y-4 border-2 border-green-400 p-6 bg-black">
            <p>¡BIENVENIDX, ALMA VALIENTE!</p>
            <p>¿ESTÁS LISTX PARA SUBIR DE NIVEL EN 2025?</p>
            <p>ESCRIBÍ TUS PROPÓSITOS PARA ESTE AÑO ACÁ. AL FINAL DEL AÑO RECORDAREMOS QUÉ ANOTASTE.</p>
          </div>

          {!showForm ? (
            <>
              <div className="w-full border-2 border-green-400 bg-black/80 p-6">
                <h2 className="text-sm mb-4 text-center">YA PARTICIPARON</h2>
                <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                  {isLoadingParticipants ? (
                    <div className="text-center py-8 loading-pulse">
                      CARGANDO PARTICIPANTES...
                    </div>
                  ) : participants.length === 0 ? (
                    <div className="text-center py-8 opacity-60">
                      SOS LA PRIMERA PERSONA EN PARTICIPAR
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-0.5">
                      {participants.map((participant) => (
                        <div 
                          key={participant.id}
                          className="flex flex-col items-center gap-2 p-2 border border-green-400/30 hover:border-green-400 transition-colors bg-black"
                        >
                          <div className="relative w-12 h-[30px] mb-2">
                            <Image
                              src={`/avatars/${participant.character}.png`}
                              alt={participant.name}
                              fill
                              className="pixelated object-contain"
                            />
                          </div>
                          <div className="text-[10px] text-center">
                            <p className="font-bold mb-1">{participant.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <div className="w-12 h-0.5 bg-green-400"></div>
                  <div className={`w-8 h-8 border-2 ${formStep === 3 ? 'bg-green-400 text-black' : ''} border-green-400 flex items-center justify-center`}>
                    3
                  </div>
                </div>
              </div>

              <div className="w-full space-y-8 border-2 border-green-400 p-6 bg-black">
                {formStep === 3 ? (
                  <form onSubmit={handleSubmit}>
                    {renderFormStep()}
                  </form>
                ) : (
                  renderFormStep()
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
