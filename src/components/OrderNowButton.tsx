import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const OrderNowButton = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const formElement = document.getElementById('order-form');
      if (formElement) {
        const formPosition = formElement.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Hide button when form is visible on screen (with some offset)
        if (formPosition < windowHeight * 0.8) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    const formElement = document.getElementById('order-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToForm}
      className="fixed bottom-6 right-6 z-50 text-lg h-12 font-bold shadow-lg hover:scale-105 transition-transform duration-300 px-16 min-w-[240px] animate-pulse-slow"
      size="lg"
    >
      اطلب الآن
    </Button>
  );
};
