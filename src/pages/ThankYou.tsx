import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Package, Mail, Phone } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 page-content">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 rounded-full p-4">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            شكراً لطلبك!
          </h1>

          {/* Message */}
          <p className="text-lg text-muted-foreground mb-8">
            تم استلام طلبك بنجاح. سنتصل بك قريباً لتأكيد التفاصيل.
          </p>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-accent/30 rounded-lg p-4">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold">التوصيل السريع</p>
              <p className="text-xs text-muted-foreground">2-5 أيام عمل</p>
            </div>
            <div className="bg-accent/30 rounded-lg p-4">
              <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold">سنتصل بك</p>
              <p className="text-xs text-muted-foreground">خلال 24 ساعة</p>
            </div>
            <div className="bg-accent/30 rounded-lg p-4">
              <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold">تأكيد بالبريد</p>
              <p className="text-xs text-muted-foreground">تحقق من بريدك</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-primary/5 rounded-lg p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-2">
              إذا كان لديك أي سؤال، يمكنك الاتصال بنا:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:0556482798" className="text-primary font-semibold hover:underline">
                📞 0556482798
              </a>
              <a href="mailto:yacinemed2020@gmail.com" className="text-primary font-semibold hover:underline">
                ✉️ yacinemed2020@gmail.com
              </a>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="default"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link to="/">
                <Home className="ml-2 h-5 w-5" />
                العودة إلى المتجر
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link to="/contact">
                اتصل بنا
              </Link>
            </Button>
          </div>

          {/* Auto redirect message */}
          <p className="text-xs text-muted-foreground mt-6">
            سيتم توجيهك تلقائياً إلى الصفحة الرئيسية خلال 10 ثوانٍ...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
