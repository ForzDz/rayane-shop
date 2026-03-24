import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Package, Mail, Phone, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state as {
    orderId: string;
    productName: string;
    totalPrice: number;
    wilaya: string;
  } | null;

  useEffect(() => {
    // Launch confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#2563eb', '#3b82f6', '#60a5fa'] // Primary blue shades
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2563eb', '#3b82f6', '#60a5fa']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Auto-redirect after 15 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full relative z-10"
      >
        <div className="bg-card/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12 text-center overflow-hidden relative">
          
          {/* Top Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />

          {/* Success Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="bg-background rounded-full p-2 relative shadow-lg">
                <CheckCircle2 className="h-24 w-24 text-primary" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
          >
            شكراً لطلبك!
          </motion.h1>

          {/* Message */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed"
          >
            تم تسجيل طلبك بنجاح. سيتم التواصل معك خلال 24-48 ساعة لتأكيد الطلب.
          </motion.p>

          {/* Order Details Summary */}
          {orderData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-primary/5 rounded-2xl p-6 border border-primary/10 mb-8 text-right max-w-sm mx-auto shadow-inner"
              dir="rtl"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-primary/10">
                <span className="text-muted-foreground font-medium">رقم الطلب:</span>
                <span className="font-extrabold text-xl text-primary bg-background px-3 py-1 rounded-lg border border-primary/20 shadow-sm">
                  #{orderData.orderId}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">المنتج:</span>
                  <span className="font-semibold text-foreground truncate mr-4">{orderData.productName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الولاية:</span>
                  <span className="font-semibold text-foreground">{orderData.wilaya}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-primary/10 mt-2">
                  <span className="font-bold text-foreground">المجموع:</span>
                  <span className="font-bold text-lg text-[#0ea5e9]">
                    {orderData.totalPrice.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* WhatsApp Button */}
          {orderData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-10 flex justify-center"
            >
              <a 
                href={`https://wa.me/213556482798?text=${encodeURIComponent(`مرحباً، أريد متابعة طلبي رقم #${orderData.orderId}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg h-14 px-8 rounded-xl shadow-[0_8px_20px_-6px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_24px_-8px_rgba(37,211,102,0.5)] hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                dir="rtl"
              >
                <MessageCircle className="h-6 w-6" />
                تواصل معنا عبر واتساب
              </a>
            </motion.div>
          )}

          {/* Info Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-background/60 backdrop-blur-sm border rounded-2xl p-6 hover:border-primary/50 transition-colors group">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-1">تحضيرسريع</h3>
              <p className="text-sm text-muted-foreground">يتم تجهيز طلبك بعناية</p>
            </div>

            <div className="bg-background/60 backdrop-blur-sm border rounded-2xl p-6 hover:border-primary/50 transition-colors group">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-1">تأكيد هاتفي</h3>
              <p className="text-sm text-muted-foreground">اتصال خلال 24 ساعة</p>
            </div>

            <div className="bg-background/60 backdrop-blur-sm border rounded-2xl p-6 hover:border-primary/50 transition-colors group">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-1">دفع عند الاستلام</h3>
              <p className="text-sm text-muted-foreground">افحص طلبك قبل الدفع</p>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-10 p-6 bg-primary/5 rounded-2xl border border-primary/10"
          >
            <p className="text-sm font-medium text-muted-foreground mb-4">
              هل لديك استفسار؟ نحن هنا للمساعدة
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="tel:0556482798" className="flex items-center gap-2 text-foreground font-bold hover:text-primary transition-colors dir-ltr">
                <Phone className="h-4 w-4" />
                <span>0556 48 27 98</span>
              </a>
              <span className="hidden sm:block text-muted-foreground/30">|</span>
              <a href="mailto:yacinemed2020@gmail.com" className="flex items-center gap-2 text-foreground font-bold hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                <span>yacinemed2020@gmail.com</span>
              </a>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              variant="default"
              size="lg"
              className="w-full sm:w-auto text-lg h-14 px-8 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
            >
              <Link to="/">
                <Home className="ml-2 h-5 w-5" />
                العودة للتسوق
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg h-14 px-8 rounded-xl font-medium hover:bg-muted"
            >
              <Link to="/contact">
                اتصل بنا
                <ArrowRight className="mr-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Auto redirect message */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              جاري التوجيه للصفحة الرئيسية...
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYou;
