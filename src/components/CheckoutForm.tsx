import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Truck, ShieldCheck, Banknote, Home, Building2, User, Phone, MapPin } from "lucide-react";
import { communesByWilaya } from "@/data/communes";
import { getDeliveryPrice, deliveryRates } from "@/data/deliveryRates";

interface CheckoutFormProps {
  product: Product;
}

export const CheckoutForm = ({ product }: CheckoutFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    wilaya: "",
    commune: "",
    deliveryType: "domicile",
  });

  const wilayas = Object.keys(communesByWilaya);
  const availableCommunes = formData.wilaya ? communesByWilaya[formData.wilaya] : [];

  // Check availability
  const cleanWilaya = formData.wilaya.replace(/^\d+-/, '');
  const isStopDeskAvailable = deliveryRates[cleanWilaya]?.bureau !== null;
  
  const deliveryPrice = getDeliveryPrice(formData.wilaya, formData.deliveryType as 'domicile' | 'stop_desk');
  const totalPrice = product.price + deliveryPrice;

  // Auto-switch to domicile if stop desk is not available
  useEffect(() => {
    if (!isStopDeskAvailable && formData.deliveryType === 'stop_desk') {
      setFormData(prev => ({ ...prev, deliveryType: 'domicile' }));
    }
  }, [formData.wilaya, isStopDeskAvailable, formData.deliveryType]);

  const handleWilayaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      wilaya: value,
      commune: "" // Reset commune when wilaya changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Submit to Netlify Forms (Backup & Dashboard)
      const formElement = e.target as HTMLFormElement;
      const formDataNetlify = new FormData(formElement);
      
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formDataNetlify as any).toString(),
      });

      // 2. Send Email via Netlify Function (Gmail/Nodemailer)
      const emailResponse = await fetch("/.netlify/functions/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.firstName,
          telephone: formData.phone,
          wilaya: formData.wilaya,
          commune: formData.commune,
          deliveryType: formData.deliveryType,
          deliveryPrice: deliveryPrice,
          produits: [{ name: product.name, price: product.price, quantity: 1 }],
          total: totalPrice
        }),
      });

      const emailData = await emailResponse.json().catch(() => ({}));

      if (!emailResponse.ok) {
        console.error("Erreur envoi email:", emailData);
        throw new Error(emailData.message || emailData.error || "Failed to send email");
      }

      toast({
        title: "تم تأكيد الطلب!",
        description: "شكرًا على طلبك. سنتصل بك قريبًا.",
      });

      navigate("/merci");
    } catch (error) {
      console.error('Order error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "خطأ",
        description: errorMessage.includes('Configuration') || errorMessage.includes('EMAIL')
          ? "خطأ في الإعدادات. يرجى التحقق من إعدادات الخادم."
          : errorMessage.includes('Failed to send email') || errorMessage.includes('Email')
          ? "فشل إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى."
          : "حدث خطأ. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg border p-6 md:p-8">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        name="order-form"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        {/* Hidden fields for Netlify */}
        <input type="hidden" name="form-name" value="order-form" />
        <input type="hidden" name="bot-field" />
        <input type="hidden" name="product-name" value={product.name} />
        <input type="hidden" name="product-price" value={product.price} />
        <input type="hidden" name="delivery-price" value={deliveryPrice} />
        <input type="hidden" name="total-price" value={totalPrice} />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              الاسم واللقب
            </Label>
            <Input 
              id="fullName"
              name="fullName"
              required 
              placeholder="اسمك الكامل"
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              رقم الهاتف
            </Label>
            <Input 
              id="phone"
              name="phone"
              required 
              type="tel" 
              placeholder="05 XX XX XX XX"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                الولاية
              </Label>
              <Select 
                name="wilaya"
                value={formData.wilaya} 
                onValueChange={handleWilayaChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="الولاية" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {wilayas.map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                البلدية
              </Label>
              <Select 
                name="commune"
                value={formData.commune} 
                onValueChange={(v) => setFormData({...formData, commune: v})}
                disabled={!formData.wilaya}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="البلدية" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {availableCommunes.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>طريقة التوصيل</Label>
          <input type="hidden" name="deliveryType" value={formData.deliveryType} />
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`border rounded-lg py-2 px-1 cursor-pointer transition-all ${formData.deliveryType === 'domicile' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
              onClick={() => setFormData({...formData, deliveryType: 'domicile'})}
            >
              <div className="flex flex-col items-center text-center gap-1">
                <Home className={`h-5 w-5 ${formData.deliveryType === 'domicile' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-xs font-medium">إلى المنزل</span>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg py-2 px-1 transition-all ${
                !isStopDeskAvailable 
                  ? 'opacity-50 cursor-not-allowed bg-muted' 
                  : formData.deliveryType === 'stop_desk' 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary cursor-pointer' 
                    : 'hover:border-primary/50 cursor-pointer'
              }`}
              onClick={() => isStopDeskAvailable && setFormData({...formData, deliveryType: 'stop_desk'})}
            >
              <div className="flex flex-col items-center text-center gap-1">
                <Building2 className={`h-5 w-5 ${!isStopDeskAvailable ? 'text-muted-foreground' : formData.deliveryType === 'stop_desk' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-xs font-medium">
                  {isStopDeskAvailable ? "Stop Desk (ZR Express)" : "غير متوفر"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">سعر المنتج</span>
              <span className="font-medium">{product.price.toLocaleString()} DA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">التوصيل</span>
              <span className="font-medium">{deliveryPrice.toLocaleString()} DA</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
            <span>المجموع المطلوب</span>
            <span className="text-primary text-2xl">
              {totalPrice.toLocaleString()} DA
            </span>
          </div>

          <Button 
            type="submit" 
            className="w-full text-lg h-12 font-bold animate-pulse" 
            size="lg"
            disabled={loading}
          >
            {loading ? "جاري المعالجة..." : "اطلب الآن"}
          </Button>

          <div className="grid grid-cols-3 gap-2 pt-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-[10px] uppercase">ضمان</p>
                <p className="text-[9px] text-muted-foreground leading-tight">استرجاع المال إذا لم ترضَ</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-[10px] uppercase">توصيل</p>
                <p className="text-[9px] text-muted-foreground leading-tight">سريع في 58 ولاية</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-[10px] uppercase">دفع</p>
                <p className="text-[9px] text-muted-foreground leading-tight">عند الاستلام (يدًا بيد)</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
