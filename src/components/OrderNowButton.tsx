import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import * as fpixel from "@/lib/fpixel";

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
      // Facebook Pixel — AddToCart
      fpixel.event('AddToCart', {
        content_name: 'Floating Order Button',
        content_type: 'product',
      });

      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToForm}
      className="fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto z-50 text-lg h-14 md:h-12 font-bold shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 md:min-w-[240px] animate-pulse-slow"
      size="lg"
    >
      اطلب الآن
    </Button>
  );
};
