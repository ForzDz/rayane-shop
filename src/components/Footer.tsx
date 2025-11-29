import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">Rayan shop</h3>
            <p className="text-sm opacity-90 mb-4">
              متجرك الإلكتروني الموثوق في الجزائر. منتجات أصلية، توصيل سريع في 58 ولاية.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="https://www.facebook.com/rayanshoppp" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/rayen_shopping/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">خدمة العملاء</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shipping" className="hover:text-primary transition-colors">
                  التوصيل والإرجاع
                </Link>
              </li>
              <li>
                <Link to="/payment" className="hover:text-primary transition-colors">
                  طرق الدفع
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  الشروط والأحكام
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">اتصل بنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>0556482798</span>
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>yacinemed2020@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>الجزائر، الجزائر</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Rayan shop. جميع الحقوق محفوظة.</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="flex items-center gap-1">
              ✓ دفع آمن
            </span>
            <span className="flex items-center gap-1">
              ✓ توصيل سريع
            </span>
            <span className="flex items-center gap-1">
              ✓ خدمة العملاء 24/7
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};