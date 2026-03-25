import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Package, MapPin, ShoppingBag, CalendarDays, AlertCircle, Truck } from "lucide-react";
import { Link } from "react-router-dom";

type OrderStatus = "pending" | "confirmed" | "processing" | "in_transit" | "delivered" | "cancelled" | "returned";

interface TrackedOrder {
  public_order_id: string;
  product_name: string;
  wilaya: string;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  delivery_type: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; borderColor: string; icon: string }> = {
  pending:    { label: "قيد المعالجة",  color: "text-amber-700",  bgColor: "bg-amber-50",  borderColor: "border-amber-200", icon: "⏳" },
  confirmed:  { label: "تم التأكيد",    color: "text-blue-700",   bgColor: "bg-blue-50",   borderColor: "border-blue-200",  icon: "✅" },
  processing: { label: "قيد التحضير",   color: "text-indigo-700", bgColor: "bg-indigo-50", borderColor: "border-indigo-200", icon: "📦" },
  in_transit: { label: "قيد التوصيل",   color: "text-orange-700", bgColor: "bg-orange-50", borderColor: "border-orange-200", icon: "🚚" },
  delivered:  { label: "تم التسليم",    color: "text-green-700",  bgColor: "bg-green-50",  borderColor: "border-green-200",  icon: "🎉" },
  cancelled:  { label: "ملغى",          color: "text-red-700",    bgColor: "bg-red-50",    borderColor: "border-red-200",    icon: "❌" },
  returned:   { label: "مرتجع",         color: "text-gray-700",   bgColor: "bg-gray-50",   borderColor: "border-gray-200",   icon: "↩️" },
};

// Timeline steps for visual progress
const timelineSteps: { status: OrderStatus; label: string }[] = [
  { status: "pending",    label: "استلام الطلب" },
  { status: "confirmed",  label: "التأكيد" },
  { status: "processing", label: "التحضير" },
  { status: "in_transit",  label: "التوصيل" },
  { status: "delivered",   label: "التسليم" },
];

const getStepIndex = (status: OrderStatus): number => {
  if (status === "cancelled" || status === "returned") return -1;
  return timelineSteps.findIndex((s) => s.status === status);
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setOrder(null);
    setSearched(true);

    const { data, error: queryError } = await supabase
      .from("orders")
      .select("public_order_id, product_name, wilaya, total_price, status, created_at, delivery_type")
      .eq("public_order_id", trimmed)
      .maybeSingle();

    if (queryError) {
      setError("حدث خطأ أثناء البحث. حاول مرة أخرى.");
    } else if (!data) {
      setError("لم يتم العثور على طلب بهذا الرقم. تأكد من الرقم وحاول مرة أخرى.");
    } else {
      setOrder(data as TrackedOrder);
    }

    setLoading(false);
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-background via-primary/5 to-background py-12 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">تتبع طلبك</h1>
          <p className="text-muted-foreground">أدخل رقم الطلب لمعرفة حالته الحالية</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <Input
            placeholder="أدخل رقم الطلب (مثال: CMD-2026-XXXXXX)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="h-12 text-base bg-card border-border/60 focus:border-primary text-right font-mono"
            dir="ltr"
          />
          <Button
            type="submit"
            disabled={loading || !orderId.trim()}
            className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shrink-0"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="h-5 w-5 ml-2" />
                تتبع طلبي
              </>
            )}
          </Button>
        </form>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center mb-6 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-3">
            {/* Status Banner */}
            {(() => {
              const cfg = statusConfig[order.status] || statusConfig.pending;
              return (
                <div className={`${cfg.bgColor} ${cfg.borderColor} border-b px-6 py-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cfg.icon}</span>
                    <div>
                      <p className={`font-bold text-lg ${cfg.color}`}>{cfg.label}</p>
                      <p className="text-xs text-muted-foreground">رقم الطلب: <span className="font-mono font-bold">{order.public_order_id}</span></p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Timeline Progress (only for non-cancelled) */}
            {currentStepIndex >= 0 && (
              <div className="px-6 py-5 border-b border-border/50">
                <div className="flex items-center justify-between relative">
                  {/* Progress bar background */}
                  <div className="absolute top-4 right-4 left-4 h-1 bg-gray-200 rounded-full" />
                  {/* Progress bar fill */}
                  <div
                    className="absolute top-4 right-4 h-1 bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }}
                  />

                  {timelineSteps.map((step, i) => {
                    const isCompleted = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    return (
                      <div key={step.status} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                            isCompleted
                              ? "bg-primary border-primary text-white"
                              : "bg-white border-gray-300 text-gray-400"
                          } ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}`}
                        >
                          {isCompleted ? "✓" : i + 1}
                        </div>
                        <span className={`text-xs mt-2 whitespace-nowrap ${isCompleted ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
                  <ShoppingBag className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">المنتج</p>
                    <p className="font-semibold text-sm truncate">{order.product_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">الولاية</p>
                    <p className="font-semibold text-sm">{order.wilaya}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
                  <CalendarDays className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">تاريخ الطلب</p>
                    <p className="font-semibold text-sm">{new Date(order.created_at).toLocaleDateString("ar-DZ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
                  <Package className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">المجموع</p>
                    <p className="font-bold text-sm text-[#0ea5e9]">{order.total_price.toLocaleString("fr-DZ")} DA</p>
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/50">
                طريقة التوصيل: <span className="font-semibold">{order.delivery_type === "domicile" ? "🏠 للمنزل" : "📦 مكتب ZR Express"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state hint */}
        {!searched && !order && !error && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">أدخل رقم الطلب الذي تلقيته عند تأكيد الطلب</p>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-sm text-primary hover:underline font-medium">
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
