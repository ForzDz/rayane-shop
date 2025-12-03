import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
      {/* Top bar */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <a href="tel:+213556482798" className="flex items-center gap-2 hover:text-primary transition-colors" aria-label="Call us at 0556482798">
                <Phone className="h-4 w-4" />
                <span>0556482798</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs md:text-sm">🚚 التوصيل في 58 ولاية</span>
              <span className="hidden md:inline text-xs">✓ الدفع عند الاستلام</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Actions */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              اتصل بنا
            </Link>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="Rayan Shop Home">
            <div className="text-2xl font-bold text-primary">
              Rayan<span className="text-black">shop</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};