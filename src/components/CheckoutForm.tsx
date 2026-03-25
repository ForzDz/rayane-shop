import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Home, Building2, User, Phone, MapPin, Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { communesByWilaya } from "@/data/communes";
import { getDeliveryPrice, deliveryRates } from "@/data/deliveryRates";
import { googleSheetsService } from "@/services/googlesheets.service";
import { supabase } from "@/lib/supabaseClient";
import { generatePublicOrderId } from "@/lib/orderId";
import type { CommandeData } from "@/types/zrexpress.types";

interface CheckoutFormProps {
  product: Product;
}

export const CheckoutForm = ({ product }: CheckoutFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const checkoutTracked = useRef(false);

  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    wilaya: "",
    commune: "",
    deliveryType: "domicile",
  });

  const wilayas = Object.keys(communesByWilaya);
  const availableCommunes = formData.wilaya ? communesByWilaya[formData.wilaya] : [];

  const cleanWilaya = formData.wilaya ? formData.wilaya.replace(/^\d+-/, '') : '';
  const isStopDeskAvailable = cleanWilaya ? deliveryRates[cleanWilaya]?.bureau !== null : false;
  
  const deliveryPrice = getDeliveryPrice(formData.wilaya, formData.deliveryType as 'domicile' | 'stop_desk');
  const productTotal = product.price * quantity;
  const totalPrice = productTotal + deliveryPrice;

  useEffect(() => {
    if (!isStopDeskAvailable && formData.deliveryType === 'stop_desk') {
      setFormData(prev => ({ ...prev, deliveryType: 'domicile' }));
    }
  }, [formData.wilaya, isStopDeskAvailable, formData.deliveryType]);

  const handleWilayaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      wilaya: value,
      commune: ""
    }));
  };

  // Event tracking (fires once on first form focus)
  const handleFormFocus = () => {
    if (!checkoutTracked.current) {
      checkoutTracked.current = true;
      
      // Facebook Pixel — InitiateCheckout
      if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
          value: totalPrice,
          currency: 'DZD',
        });
      }

      // Google Analytics 4 — begin_checkout
      if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
          currency: 'DZD',
          value: totalPrice,
          items: [{
            item_id: (product as any).id || product.name,
            item_name: product.name,
            price: product.price,
            quantity: quantity
          }]
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e.preventDefault) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const formElement = e.target as HTMLFormElement;
      const formDataNetlify = new FormData(formElement);
      
      try {
        await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formDataNetlify as any).toString(),
        });
      } catch (err) {
        console.warn("Netlify form submission failed, continuing to Google Sheets...");
      }

      const commandeData: CommandeData = {
        nomClient: formData.firstName,
        telephone: formData.phone,
        adresse: formData.deliveryType === 'stop_desk' ? `Bureau ZR Express - ${formData.wilaya}` : (document.getElementById('address') as HTMLInputElement)?.value || '',
        wilaya: formData.wilaya,
        commune: formData.commune || '',
        produit: product.name,
        quantite: quantity,
        prix: product.price,
        deliveryType: formData.deliveryType,
        deliveryPrice: deliveryPrice,
        totalPrice: totalPrice
      };

      const cleanWilayaLabel = formData.wilaya ? formData.wilaya.replace(/^\d+-\s*/, "") : "";
      const addressValue =
        formData.deliveryType === "stop_desk"
          ? null
          : (document.getElementById("address") as HTMLInputElement)?.value || null;

      const publicOrderId = generatePublicOrderId();

      const { error: insertError } = await supabase.from("orders").insert({
        public_order_id: publicOrderId,
        customer_full_name: formData.firstName,
        customer_phone: formData.phone,
        wilaya_raw: formData.wilaya,
        wilaya: cleanWilayaLabel || formData.wilaya,
        commune: formData.deliveryType === "stop_desk" ? null : formData.commune || null,
        address: addressValue,
        delivery_type: formData.deliveryType,
        product_id: (product as any).id ?? null,
        product_name: product.name,
        unit_price: product.price,
        quantity: quantity,
        subtotal: productTotal,
        delivery_price: deliveryPrice,
        total_price: totalPrice,
        status: "pending",
        notes: null,
      });

      if (insertError) {
        throw new Error(`Supabase: ${insertError.message}`);
      }

      const response = await googleSheetsService.envoyerCommande(commandeData);

      if (!response.success) {
        console.error("Erreur Envoi:", response.error);
        throw new Error("Erreur de connexion. Veuillez réessayer.");
      }

      // Admin Email Notification (Async/Non-blocking)
      fetch("/.netlify/functions/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: publicOrderId,
          nom: formData.firstName,
          telephone: formData.phone,
          wilaya: cleanWilayaLabel || formData.wilaya,
          commune: addressValue || 'Stop Desk',
          produits: [{ name: product.name, price: product.price, quantity: quantity }],
          total: totalPrice,
          deliveryType: formData.deliveryType,
          deliveryPrice: deliveryPrice
        })
      }).catch(err => console.error("Admin Email notification failed:", err));

      toast({
        title: "تم تأكيد الطلب!",
        description: "شكرًا على طلبك. تم إرسال الطلب بنجاح.",
      });

      navigate("/merci", { 
        state: { 
          orderId: publicOrderId,
          productId: (product as any).id || product.name,
          productName: product.name,
          totalPrice: totalPrice,
          wilaya: cleanWilayaLabel || formData.wilaya,
        }
      });
    } catch (error) {
      console.error('Order error:', error);
      
      let isNetworkError = false;
      if (!navigator.onLine) {
        isNetworkError = true;
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        isNetworkError = true;
      } else if (error instanceof Error && (error.message.includes('NetworkError') || error.message.toLowerCase().includes('fetch'))) {
        isNetworkError = true;
      }

      const message = isNetworkError 
        ? "تحقق من اتصالك بالإنترنت وحاول مجدداً" 
        : "حدث خطأ، يرجى المحاولة مرة أخرى";
        
      setErrorMsg(message);
      
      toast({
        title: "خطأ",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-5 md:p-6" dir="rtl" id="order-form">
      <form 
        onSubmit={handleSubmit} 
        onFocus={handleFormFocus}
        className="space-y-4"
        name="order-form"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        <input type="hidden" name="form-name" value="order-form" />
        <input type="hidden" name="bot-field" />
        <input type="hidden" name="product-name" value={product.name} />
        <input type="hidden" name="product-price" value={product.price} />
        <input type="hidden" name="delivery-price" value={deliveryPrice} />
        <input type="hidden" name="total-price" value={totalPrice} />
        
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
            <User className="h-4 w-4 text-[#0ea5e9]" />
            الاسم واللقب
          </Label>
          <Input 
            id="fullName"
            name="fullName"
            required 
            placeholder="اسمك الكامل"
            value={formData.firstName}
            onChange={e => setFormData({...formData, firstName: e.target.value})}
            className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-[#0ea5e9] text-right transition-colors"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
            <Phone className="h-4 w-4 text-[#0ea5e9]" />
            رقم الهاتف
          </Label>
          <Input 
            id="phone"
            name="phone"
            required 
            type="tel" 
            placeholder="05 XX XX XX XX"
            pattern="^(05|06|07)( [0-9]{2}){4}$"
            title="رقم الهاتف يجب أن يبدأ بـ 05 أو 06 أو 07 ويحتوي على 10 أرقام"
            maxLength={14}
            value={formData.phone}
            onBlur={() => setPhoneTouched(true)}
            onChange={e => {
              const digits = e.target.value.replace(/\D/g, '');
              let formatted = '';
              for (let i = 0; i < digits.length; i++) {
                if (i > 0 && i % 2 === 0) formatted += ' ';
                formatted += digits[i];
              }
              const finalPhone = formatted.substring(0, 14);
              setFormData({...formData, phone: finalPhone});
              if (finalPhone.length === 14) setPhoneTouched(true);
            }}
            className={`h-11 bg-gray-50/50 focus:bg-white text-left transition-colors ${
              phoneTouched && formData.phone.length > 0 && !/^(05|06|07)( \d{2}){4}$/.test(formData.phone)
                ? 'border-red-500 focus:border-red-500 hover:border-red-500'
                : 'border-gray-200 focus:border-[#0ea5e9]'
            }`}
            dir="ltr"
          />
          {phoneTouched && formData.phone.length > 0 && !/^(05|06|07)( \d{2}){4}$/.test(formData.phone) && (
            <p className="text-sm text-red-500 font-medium mt-1 animate-in fade-in">
              رقم الهاتف غير صحيح (مثال: 05 55 12 34 56)
            </p>
          )}
        </div>

        {/* Wilaya & Commune */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
              <MapPin className="h-4 w-4 text-[#0ea5e9]" />
              الولاية
            </Label>
            <Select name="wilaya" value={formData.wilaya} onValueChange={handleWilayaChange} required>
              <SelectTrigger className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-[#0ea5e9] text-right transition-colors" dir="rtl">
                <SelectValue placeholder="الولاية" />
              </SelectTrigger>
              <SelectContent dir="rtl" className="max-h-[200px]">
                {wilayas.map((w) => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
              <MapPin className="h-4 w-4 text-[#0ea5e9]" />
              البلدية
            </Label>
            <Select name="commune" value={formData.commune} onValueChange={(v) => setFormData({...formData, commune: v})} disabled={!formData.wilaya || formData.deliveryType === 'stop_desk'} required={formData.deliveryType !== 'stop_desk'}>
              <SelectTrigger className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-[#0ea5e9] text-right transition-colors" dir="rtl">
                <SelectValue placeholder="البلدية" />
              </SelectTrigger>
              <SelectContent dir="rtl" className="max-h-[200px]">
                {availableCommunes.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="address" className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
            <MapPin className="h-4 w-4 text-[#0ea5e9]" />
            العنوان
          </Label>
          <Input 
            id="address"
            name="address"
            required={formData.deliveryType !== 'stop_desk'}
            disabled={formData.deliveryType === 'stop_desk'}
            placeholder="أدخل عنوانك الكامل"
            className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-[#0ea5e9] text-right disabled:opacity-50 transition-colors"
          />
        </div>

        {/* Delivery Method */}
        <div className="space-y-1.5 pt-1">
          <Label className="text-sm font-semibold text-gray-800 block mb-2">طريقة التوصيل</Label>
          <input type="hidden" name="deliveryType" value={formData.deliveryType} />
          <div className="grid grid-cols-2 gap-3">
            <div 
              className={`flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer transition-all border ${formData.deliveryType === 'domicile' ? 'border-[#0ea5e9] bg-blue-50/50 shadow-sm' : 'border-gray-200 bg-gray-100/50 hover:bg-gray-50'}`}
              onClick={() => setFormData({...formData, deliveryType: 'domicile'})}
            >
              <Home className={`h-5 w-5 mb-1.5 ${formData.deliveryType === 'domicile' ? 'text-[#0ea5e9]' : 'text-gray-400'}`} />
              <span className={`text-sm ${formData.deliveryType === 'domicile' ? 'text-blue-700 font-semibold' : 'text-gray-500'}`}>إلى المنزل</span>
            </div>
            
            <div 
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border ${
                  !isStopDeskAvailable 
                    ? 'opacity-60 cursor-not-allowed bg-gray-100/80 border-gray-200' 
                    : formData.deliveryType === 'stop_desk' 
                      ? 'border-[#0ea5e9] bg-blue-50/50 shadow-sm cursor-pointer' 
                      : 'border-gray-200 bg-gray-100/50 hover:bg-gray-50 cursor-pointer'
                }`}
                onClick={() => {
                  if (isStopDeskAvailable) {
                    setFormData({...formData, deliveryType: 'stop_desk', commune: ''});
                  }
                }}
            >
              <Building2 className={`h-5 w-5 mb-1.5 ${!isStopDeskAvailable ? 'text-gray-400' : formData.deliveryType === 'stop_desk' ? 'text-[#0ea5e9]' : 'text-gray-400'}`} />
              <span className={`text-sm ${!isStopDeskAvailable ? 'text-gray-500' : formData.deliveryType === 'stop_desk' ? 'text-blue-700 font-semibold' : 'text-gray-500'}`}>
                {isStopDeskAvailable ? "مكتب ZR Express" : "غير متوفر"}
              </span>
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between border border-gray-200 bg-gray-50/50 rounded-xl p-2.5 mt-2">
          <Label className="text-sm font-semibold text-gray-800 px-2">الكمية</Label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-200/50 transition-colors rounded-md text-lg"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
            <span className="font-bold text-gray-900 text-lg min-w-[1.5rem] text-center">{quantity}</span>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-200/50 transition-colors rounded-md text-lg disabled:opacity-30"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              −
            </button>
          </div>
        </div>

        {/* Total Price Section */}
        <div className="pt-2 pb-1 space-y-1.5">
           <div className="flex justify-between items-center text-sm text-gray-600">
             <span className="font-semibold text-gray-900">{productTotal.toLocaleString("fr-DZ")} DA</span>
             <span>سعر المنتج (x{quantity})</span>
           </div>
           <div className="flex justify-between items-center text-sm text-gray-600">
             <span className="font-semibold text-gray-900">{deliveryPrice.toLocaleString("fr-DZ")} DA</span>
             <span>التوصيل</span>
           </div>
           <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100 border-dashed">
             <span className="text-2xl font-bold text-[#0ea5e9]">{totalPrice.toLocaleString("fr-DZ")} DA</span>
             <span className="font-bold text-gray-900">المجموع المطلوب</span>
           </div>
        </div>

        {/* Submit Button & Error State */}
        <div className="pt-2 space-y-3">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-600 animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed font-arabic">{errorMsg}</p>
            </div>
          )}
          
          {errorMsg ? (
            <Button 
              type="button" 
              onClick={(e) => handleSubmit(e)}
              className="w-full text-lg h-14 font-bold rounded-xl bg-gray-900 border-2 border-transparent hover:bg-gray-800 shadow-md text-white transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري إرسال طلبك...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-5 w-5" />
                  إعادة المحاولة
                </>
              )}
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="w-full text-lg h-14 font-bold rounded-xl bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 shadow-md text-white transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري إرسال طلبك...
                </>
              ) : (
                "اطلب الآن"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
