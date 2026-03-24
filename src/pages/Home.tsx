import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShoppingBag } from "lucide-react";

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  in_stock: boolean;
  is_active: boolean;
  rating: number | null;
  reviews_count: number | null;
}

interface ProductImageRow {
  image_url: string;
}

type UiProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
};

const Home = () => {
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const { data, error: pError } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (pError) {
        setError(pError.message);
        setLoading(false);
        return;
      }

      const rows = data as (DbProduct & { product_images: ProductImageRow[] })[];
      const uiProducts = rows.map(row => {
        const images = (row.product_images ?? []).map((x) => x.image_url).filter(Boolean);
        return {
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description,
          price: Number(row.price),
          originalPrice: row.original_price ? Number(row.original_price) : undefined,
          images
        };
      });

      setProducts(uiProducts);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-muted-foreground mr-3 font-medium">جاري تحميل المنتجات...</p>
    </div>
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-center">
          <p className="text-sm text-destructive">
            خطأ في تحميل المنتجات: {error}
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) return <div className="container mx-auto px-4 py-20 text-center text-xl text-muted-foreground font-medium">لا توجد منتجات متوفرة حاليا.</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative py-20 px-4 mb-10 overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 border-primary/30 text-primary bg-primary/5 text-sm font-semibold rounded-full shadow-sm hover:bg-primary/10 transition-colors cursor-default">
            <Sparkles className="w-4 h-4 ml-2 inline-block animate-pulse" />
            الجودة مضمونة
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight tracking-tight">
            اكتشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">منتجاتنا المميزة</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium mb-10 leading-relaxed">
            أفضل التركيبات والعروض المخصصة لجمالك وعنايتك الشخصية وتسوقك اليومي.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="rounded-full shadow-lg shadow-primary/25 h-14 px-8 text-lg font-bold gap-3 group">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              ابدأ التسوق
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Modern Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="group relative bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-primary/30 flex flex-col h-full hover:-translate-y-1">
              
              {/* Product Image Box */}
              <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] bg-muted/30 overflow-hidden">
                {product.images?.[0] ? (
                  <>
                    {/* Inner image container for scale effect without breaking border radius */}
                    <div className="w-full h-full overflow-hidden transition-transform duration-700 ease-in-out group-hover:scale-105">
                      <img
                        src={`${product.images[0]}?width=400&quality=70&format=webp`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width="400"
                        height="300"
                      />
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 text-sm font-medium">لا توجد صورة</div>
                )}
                
                {/* Sale Badge */}
                {product.originalPrice && (
                  <div className="absolute top-4 right-4 z-10 animate-fade-in">
                    <div className="relative">
                      <div className="absolute inset-0 bg-destructive blur-md opacity-40 rounded-full" />
                      <Badge variant="destructive" className="relative text-sm font-bold px-3 py-1.5 shadow-md">
                        تخفيض {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </Badge>
                    </div>
                  </div>
                )}
                
                {/* Hover Quick Action */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="bg-white/90 backdrop-blur-sm text-foreground text-sm font-bold px-5 py-2.5 rounded-full shadow-lg border border-white/50">
                    عرض التفاصيل ←
                  </span>
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-card to-muted/10">
                <Link to={`/product/${product.id}`} className="block mb-2 mt-1">
                  <h3 className="text-xl font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-1 mb-5 flex-1">
                  {product.description}
                </p>
                
                {/* Price Display */}
                <div className="mt-auto">
                  <div className="h-px w-full bg-border/50 mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                      <span className="text-2xl font-black text-foreground">
                        {product.price.toLocaleString("fr-DZ")} <span className="text-lg text-primary mr-0.5">DA</span>
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm font-medium text-muted-foreground line-through decoration-destructive/30 decoration-2">
                          {product.originalPrice.toLocaleString("fr-DZ")} DA
                        </span>
                      )}
                    </div>
                  </div>

                  <Button asChild className="w-full mt-5 rounded-xl h-12 text-base font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Voir produit
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;