import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Pencil, EyeOff } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  original_price: number | null;
  in_stock: boolean;
  is_active: boolean;
  created_at: string;
}

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setProducts((data as Product[]) ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !current })
      .eq("id", id);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p))
      );
    } else {
      setError(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">المنتجات</h1>
          <p className="text-sm text-muted-foreground">
            إدارة منتجات التجميل (إضافة، تعديل، إيقاف العرض).
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 ml-1" />
            منتج جديد
          </Link>
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المنتج</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>السعر الأصلي</TableHead>
                <TableHead>المخزون</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="h-5 w-5 inline-block animate-spin mr-2" />
                    جاري تحميل المنتجات...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    لا توجد منتجات بعد.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-xs text-muted-foreground">{product.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{product.category}</TableCell>
                    <TableCell className="text-sm font-semibold">
                      {product.price.toLocaleString("fr-DZ")} DA
                    </TableCell>
                    <TableCell className="text-sm">
                      {product.original_price
                        ? `${product.original_price.toLocaleString("fr-DZ")} DA`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant={product.in_stock ? "outline" : "destructive"}>
                        {product.in_stock ? "متوفر" : "غير متوفر"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "ظاهر في المتجر" : "مخفى"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="inline-flex items-center text-xs text-primary hover:underline"
                      >
                        <Pencil className="h-3 w-3 ml-1" />
                        تعديل
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleActive(product.id, product.is_active)}
                        className="inline-flex items-center text-xs text-muted-foreground hover:text-destructive"
                      >
                        <EyeOff className="h-3 w-3 ml-1" />
                        {product.is_active ? "إخفاء" : "إظهار"}
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {error && (
          <p className="text-xs text-destructive pt-1">
            حدث خطأ أثناء تحميل / تحديث المنتجات: {error}
          </p>
        )}
      </Card>
    </div>
  );
};

export default AdminProducts;

