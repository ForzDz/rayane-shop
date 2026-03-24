import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, PackageSearch, ShoppingBag, TrendingUp, MapPin } from "lucide-react";

interface StatsResponse {
  total_orders: number;
  orders_today: number;
  orders_this_week: number;
  revenue_today: number;
  revenue_total: number;
  top_products: { product_name: string; total_quantity: number }[];
  orders_by_wilaya: { wilaya: string; total_orders: number }[];
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc("admin_dashboard_stats");

      if (error) {
        setError(error.message);
      } else {
        setStats(data as StatsResponse);
      }

      setLoading(false);
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">لوحة تحكم الطلبات</h1>
        <p className="text-muted-foreground text-sm">
          نظرة عامة على أداء المتجر (الطلبات، المداخيل، أفضل المنتجات).
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-28 animate-pulse bg-muted" />
          ))}
        </div>
      ) : error ? (
        <Card className="p-4 border-destructive/40 bg-destructive/5">
          <p className="text-sm text-destructive">
            حدث خطأ أثناء تحميل الإحصائيات: {error}
          </p>
        </Card>
      ) : stats ? (
        <>
          {/* Metrics cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">إجمالي الطلبات</span>
                <ShoppingBag className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stats.total_orders ?? 0}</div>
            </Card>

            <Card className="p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">طلبات اليوم</span>
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stats.orders_today ?? 0}</div>
            </Card>

            <Card className="p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">طلبات هذا الأسبوع</span>
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stats.orders_this_week ?? 0}</div>
            </Card>

            <Card className="p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">مداخيل اليوم (DA)</span>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">
                {stats.revenue_today?.toLocaleString("fr-DZ") ?? "0"}
              </div>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4 col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">المداخيل الإجمالية</h2>
              </div>
              <div className="text-3xl font-bold mb-2">
                {stats.revenue_total?.toLocaleString("fr-DZ") ?? "0"}{" "}
                <span className="text-base text-muted-foreground">DA</span>
              </div>
              <p className="text-xs text-muted-foreground">
                مجموع المداخيل من الطلبات المؤكدة / المسلمة.
              </p>
            </Card>

            <Card className="p-4 col-span-1 md:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">أفضل المنتجات</h2>
                <PackageSearch className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {stats.top_products?.length ? (
                  stats.top_products.map((p) => (
                    <div
                      key={p.product_name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate max-w-[70%]">{p.product_name}</span>
                      <Badge variant="outline" className="ml-2">
                        {p.total_quantity} طلب
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">لا توجد بيانات كافية بعد.</p>
                )}
              </div>
            </Card>

            <Card className="p-4 col-span-1 md:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">الطلبات حسب الولاية</h2>
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {stats.orders_by_wilaya?.length ? (
                  stats.orders_by_wilaya.map((w) => (
                    <div
                      key={w.wilaya}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{w.wilaya}</span>
                      <Badge variant="secondary">{w.total_orders}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">لا توجد بيانات كافية بعد.</p>
                )}
              </div>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AdminDashboard;

