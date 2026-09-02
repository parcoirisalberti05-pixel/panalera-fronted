import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import generated assets
// @ts-ignore
import banner1 from '../assets/images/baby_banner_1_1784067881604.jpg';
// @ts-ignore
import banner2 from '../assets/images/baby_banner_2_1784067891823.jpg';

interface CarouselProps {
  onSelectCategory: (category: 'pañales' | 'higiene' | 'ropa' | 'calzado' | 'rodados' | 'alimentacion' | 'accesorios' | null) => void;
}

export default function Carousel({ onSelectCategory }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      id: 1,
      image: banner1,
      title: "Bienvenido a Pañalera Arcoiris",
      subtitle: "Suavidad y Cuidado Orgánico",
      description: "Descubrí nuestra exclusiva línea de pañales premium y productos de higiene hipoalergénicos diseñados para cuidar la piel más delicada.",
      buttonText: "Ver Pañales & Higiene",
      action: () => onSelectCategory('pañales'),
      badge: "Novedad"
    },
    {
      id: 2,
      image: banner2,
      title: "Paseos Seguros y Felices",
      subtitle: "Cochecitos & Rodados Premium",
      description: "Explorá andadores interactivos y cochecitos de paseo travel system diseñados para brindar el máximo confort y seguridad en cada aventura.",
      buttonText: "Ver Rodados",
      action: () => onSelectCategory('rodados'),
      badge: "Destacado"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[320px] md:h-[480px] bg-slate-100 overflow-hidden rounded-3xl shadow-md mb-8 group" id="main-carousel">
      {/* Slides Container */}
      <div className="w-full h-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image */}
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Overlays */}
            <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-16 text-white bg-black/5">
              <div className="max-w-xl space-y-4 bg-slate-950/60 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold bg-rose-400/90 text-white rounded-full uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  {slides[current].badge}
                </span>
                
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  {slides[current].title}
                </h2>
                
                <p className="text-rose-100 text-sm md:text-lg font-bold">
                  {slides[current].subtitle}
                </p>
                
                <p className="text-slate-200 text-xs md:text-base leading-relaxed line-clamp-3 font-medium">
                  {slides[current].description}
                </p>

                <div className="pt-2">
                  <button
                    onClick={slides[current].action}
                    className="cursor-pointer inline-flex items-center justify-center px-6 py-3 font-bold bg-white text-slate-900 hover:bg-rose-50 rounded-full transition duration-300 shadow-lg shadow-rose-900/10 text-xs md:text-sm hover:scale-105 active:scale-95"
                    id={`carousel-btn-${slides[current].id}`}
                  >
                    {slides[current].buttonText}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
        aria-label="Anterior"
        id="carousel-prev"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
        aria-label="Siguiente"
        id="carousel-next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`cursor-pointer h-2 rounded-full transition-all duration-300 ${
              index === current ? 'bg-rose-400 w-6 md:w-8' : 'bg-white/50 hover:bg-white/80 w-2'
            }`}
            aria-label={`Slide ${index + 1}`}
            id={`carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
