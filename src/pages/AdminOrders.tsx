import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Filter, Eye, Archive, RefreshCcw } from "lucide-react";

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
  customer_full_name: string;
  customer_phone: string;
  wilaya: string;
  product_name: string;
  quantity: number;
  total_price: number;
  delivery_type: "domicile" | "stop_desk";
  status: OrderStatus;
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

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [wilaya, setWilaya] = useState<string>("all");

  const totalPages = useMemo(
    () => (totalCount ? Math.ceil(totalCount / pageSize) : 1),
    [totalCount, pageSize]
  );

  const loadOrders = async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("is_archived", false)
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (wilaya !== "all") {
      query = query.eq("wilaya", wilaya);
    }

    if (search.trim()) {
      const s = search.trim();
      query = query.or(
        `customer_phone.ilike.%${s}%,customer_full_name.ilike.%${s}%,public_order_id.ilike.%${s}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      setError(error.message);
    } else {
      setOrders((data as Order[]) ?? []);
      setTotalCount(count ?? 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    // reset à la page 1 si filtres changent
    setPage(1);
  }, [status, wilaya, search]);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, wilaya]);

  const handleArchive = async (orderId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ is_archived: true })
      .eq("id", orderId);

    if (!error) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } else {
      setError(error.message);
    }
  };

  const uniqueWilayas = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => set.add(o.wilaya));
    return Array.from(set).sort();
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">الطلبات</h1>
          <p className="text-sm text-muted-foreground">
            إدارة جميع طلبات الدفع عند الاستلام (COD).
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={loadOrders}
          disabled={loading}
        >
          <RefreshCcw className="h-4 w-4 ml-1" />
          تحديث
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        {/* Filtres */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                بحث (اسم، هاتف، ID)
              </label>
              <Input
                placeholder="ابحث عن طلب..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="min-w-[160px]">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                الحالة
              </label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as OrderStatus | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="كل الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>
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

            <div className="min-w-[160px]">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                الولاية
              </label>
              <Select value={wilaya} onValueChange={(v) => setWilaya(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="كل الولايات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الولايات</SelectItem>
                  {uniqueWilayas.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="h-3 w-3" />
            <span>
              {totalCount} طلب (صفحة {page} / {totalPages})
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">ID</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>الولاية</TableHead>
                <TableHead>المنتج</TableHead>
                <TableHead>الكمية</TableHead>
                <TableHead>المجموع</TableHead>
                <TableHead>التوصيل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    <Loader2 className="h-5 w-5 inline-block animate-spin mr-2" />
                    جاري تحميل الطلبات...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center text-sm text-muted-foreground">
                    لا توجد طلبات مطابقة للفلاتر الحالية.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      {order.public_order_id}
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(order.created_at).toLocaleString("fr-DZ")}
                    </TableCell>
                    <TableCell className="text-sm">{order.customer_full_name}</TableCell>
                    <TableCell className="text-sm">{order.customer_phone}</TableCell>
                    <TableCell className="text-sm">{order.wilaya}</TableCell>
                    <TableCell className="text-sm truncate max-w-[160px]">
                      {order.product_name}
                    </TableCell>
                    <TableCell className="text-center">{order.quantity}</TableCell>
                    <TableCell className="text-sm font-semibold">
                      {order.total_price.toLocaleString("fr-DZ")} DA
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline">
                        {order.delivery_type === "domicile" ? "لمنزل" : "مكتب"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
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
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center text-xs text-primary hover:underline"
                      >
                        <Eye className="h-3 w-3 ml-1" />
                        عرض
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleArchive(order.id)}
                        className="inline-flex items-center text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Archive className="h-3 w-3 ml-1" />
                        أرشفة
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span>
              عرض {(page - 1) * pageSize + 1} -{" "}
              {Math.min(page * pageSize, totalCount)} من {totalCount}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                السابق
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                التالي
              </Button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-destructive pt-1">
            حدث خطأ أثناء تحميل الطلبات: {error}
          </p>
        )}
      </Card>
    </div>
  );
};

export default AdminOrders;

