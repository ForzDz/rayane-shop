import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-12">
          {/* Top: Rayan Shop Info */}
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-bold text-2xl mb-4">Rayan shop</h3>
            <p className="text-base opacity-90 leading-relaxed">
              متجرك الإلكتروني الموثوق في الجزائر. منتجات أصلية، توصيل سريع في 58 ولاية.
            </p>
          </div>

          {/* Middle: Social & Contact - Compact Side by Side */}
          <div className="grid grid-cols-2 gap-4 md:gap-12 border-y border-secondary-foreground/10 py-6">
            {/* Social Media - Left */}
            <div className="text-center md:text-right">
              <h3 className="font-bold text-lg mb-3">تابعنا على</h3>
              <div className="flex flex-col gap-2">
                <a href="https://www.facebook.com/rayanshoppp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center md:justify-start hover:text-primary transition-colors group" aria-label="Visit our Facebook page">
                  <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Facebook className="h-4 w-4" />
                  </div>
                  <span className="text-sm">صفحتنا على فيسبوك</span>
                </a>
                <a href="https://www.instagram.com/rayen_shopping/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center md:justify-start hover:text-primary transition-colors group" aria-label="Visit our Instagram page">
                  <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Instagram className="h-4 w-4" />
                  </div>
                  <span className="text-sm">صفحتنا على إنستغرام</span>
                </a>
              </div>
            </div>

            {/* Contact - Right */}
            <div className="text-center md:text-right">
              <h3 className="font-bold text-lg mb-3">اتصل بنا</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 justify-center md:justify-start">
                  <Phone className="h-4 w-4" />
                  <span>0556482798</span>
                </li>
                <li className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="break-all">yacinemed2020@gmail.com</span>
                </li>
                <li className="flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span>الجزائر، وهران</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom: Links */}
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto w-full text-center md:text-right">
            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-sm">
                <li><span>الرئيسية</span></li>
                <li><span>المنتجات</span></li>
                <li><span>من نحن</span></li>
                <li><span>اتصل بنا</span></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-bold text-lg mb-4">خدمة العملاء</h3>
              <ul className="space-y-2 text-sm">
                <li><span>التوصيل والإرجاع</span></li>
                <li><span>طرق الدفع</span></li>
                <li><span>الأسئلة الشائعة</span></li>
                <li><span>الشروط والأحكام</span></li>
              </ul>
            </div>
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