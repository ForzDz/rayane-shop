import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, MapPin, Phone, User, Truck, Package, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "returned";

interface Order {
  id: string;
  public_order_id: string;
  created_at: string;
  updated_at: string;
  customer_full_name: string;
  customer_phone: string;
  wilaya_raw: string;
  wilaya: string;
  commune: string | null;
  address: string | null;
  delivery_type: "domicile" | "stop_desk";
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  delivery_price: number;
  total_price: number;
  status: OrderStatus;
  notes: string | null;
}

const statusLabels: Record<OrderStatus, string> = {
  pending: "في الانتظار",
  confirmed: "مؤكد",
  processing: "قيد التحضير",
  in_transit: "في الطريق",
  delivered: "تم التسليم",
  cancelled: "ملغاة",
  returned: "مرتجعة",
};

export const AdminOrderDetail = () => {
  const { id } = useParams();
  const { user, role } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        const o = data as Order;
        setOrder(o);
        setStatus(o.status);
        setNotes(o.notes ?? "");
      }

      setLoading(false);
    };

    loadOrder();
  }, [id]);

  const handleSave = async () => {
    if (!order || !status) return;
    setSaving(true);
    setError(null);

    const previousStatus = order.status;
    const { error } = await supabase
      .from("orders")
      .update({
        status,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (error) {
      setError(error.message);
    } else {
      if (previousStatus !== status) {
        await supabase.from("order_logs").insert({
          order_id: order.id,
          previous_status: previousStatus,
          new_status: status,
          note: notes || null,
          actor_id: user?.id ?? null,
          actor_role: role ?? null,
        });
      }
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status,
              notes: notes || null,
              updated_at: new Date().toISOString(),
            }
          : prev
      );
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <Button asChild variant="outline" size="sm">
          <a href="/admin/orders">
            <ArrowLeft className="h-4 w-4 ml-1" />
            الرجوع إلى الطلبات
          </a>
        </Button>
        <Card className="p-4 border-destructive/40 bg-destructive/5">
          <p className="text-sm text-destructive">
            {error ? `حدث خطأ أثناء تحميل الطلب: ${error}` : "لم يتم العثور على الطلب."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            تفاصيل الطلب {order.public_order_id}
          </h1>
          <p className="text-sm text-muted-foreground">
            تم الإنشاء في{" "}
            {new Date(order.created_at).toLocaleString("fr-DZ")}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="/admin/orders">
            <ArrowLeft className="h-4 w-4 ml-1" />
            الرجوع إلى الطلبات
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Client */}
        <Card className="p-4 space-y-2">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            معلومات العميل
          </h2>
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">الاسم الكامل:</span>
              <span>{order.customer_full_name}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <a href={`tel:${order.customer_phone}`} className="text-primary">
                {order.customer_phone}
              </a>
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card className="p-4 space-y-2">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            العنوان
          </h2>
          <div className="text-sm space-y-1">
            <div>
              <span className="text-xs text-muted-foreground">الولاية:</span>{" "}
              <span>{order.wilaya}</span>
            </div>
            {order.commune && (
              <div>
                <span className="text-xs text-muted-foreground">البلدية:</span>{" "}
                <span>{order.commune}</span>
              </div>
            )}
            {order.address && (
              <div>
                <span className="text-xs text-muted-foreground">العنوان:</span>{" "}
                <span>{order.address}</span>
              </div>
            )}
            <div>
              <span className="text-xs text-muted-foreground">نوع التوصيل:</span>{" "}
              <Badge variant="outline">
                {order.delivery_type === "domicile" ? "إلى المنزل" : "مكتب ZR Express"}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Order amounts */}
        <Card className="p-4 space-y-2">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            تفاصيل الطلب
          </h2>
          <div className="text-sm space-y-1">
            <div className="truncate">
              <span className="text-xs text-muted-foreground">المنتج:</span>{" "}
              <span>{order.product_name}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">الكمية:</span>{" "}
              <span>{order.quantity}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">سعر الوحدة:</span>{" "}
              <span>{order.unit_price.toLocaleString("fr-DZ")} DA</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">المجموع الجزئي:</span>{" "}
              <span>{order.subtotal.toLocaleString("fr-DZ")} DA</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">سعر التوصيل:</span>{" "}
              <span>{order.delivery_price.toLocaleString("fr-DZ")} DA</span>
            </div>
            <div className="pt-1 border-t mt-1">
              <span className="text-xs text-muted-foreground">المجموع الكلي:</span>{" "}
              <span className="font-semibold text-primary">
                {order.total_price.toLocaleString("fr-DZ")} DA
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Status + notes */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">حالة الطلب</span>
          </div>
          <Badge
            variant={
              order.status === "delivered"
                ? "default"
                : order.status === "pending"
                ? "secondary"
                : order.status === "cancelled" || order.status === "returned"
                ? "destructive"
                : "outline"
            }
          >
            {statusLabels[order.status]}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              تغيير الحالة
            </label>
            <Select
              value={status ?? order.status}
              onValueChange={(v) => setStatus(v as OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر حالة جديدة" />
              </SelectTrigger>
              <SelectContent>
                {(
                  ["pending", "confirmed", "processing", "in_transit", "delivered", "cancelled", "returned"] as OrderStatus[]
                ).map((s) => (
                  <SelectItem key={s} value={s}>
                    {statusLabels[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              ملاحظات داخلية (غير مرئية للعميل)
            </label>
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ملاحظات عن العميل أو التسليم..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            آخر تحديث:{" "}
            {new Date(order.updated_at).toLocaleString("fr-DZ")}
          </p>
          <Button type="button" size="sm" onClick={handleSave} disabled={saving || !status}>
            {saving && <Loader2 className="h-4 w-4 ml-1 animate-spin" />}
            <Save className="h-4 w-4 ml-1" />
            حفظ التغييرات
          </Button>
        </div>

        {error && (
          <p className="text-xs text-destructive pt-1">
            حدث خطأ أثناء تحديث الطلب: {error}
          </p>
        )}
      </Card>
    </div>
  );
};

export default AdminOrderDetail;

