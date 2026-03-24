import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { CheckoutForm } from "@/components/CheckoutForm";
import { CustomerReviews } from "@/components/CustomerReviews";
import { TestimonialsDemo } from "@/components/TestimonialsDemo";
import { Badge } from "@/components/ui/badge";
import { Star, Check, ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  category: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  badge?: string;
  features: string[];
  images: string[];
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<UiProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoadingProduct(true);
      setProductError(null);

      const { data: p, error: pError } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

      if (pError) {
        setProductError(pError.message);
        setLoadingProduct(false);
        return;
      }

      if (!p) {
        setProductError("Aucun produit actif trouvé avec ce lien.");
        setLoadingProduct(false);
        return;
      }

      const productRow = p as DbProduct & { product_images: ProductImageRow[] };
      const images = (productRow.product_images ?? []).map((x) => x.image_url).filter(Boolean);

      if (!images.length) {
        setProductError("Ce produit n'a pas d'images (table product_images).");
        setLoadingProduct(false);
        return;
      }

      setProduct({
        id: productRow.id,
        name: productRow.name,
        slug: productRow.slug,
        description: productRow.description,
        price: Number(productRow.price),
        originalPrice: productRow.original_price ? Number(productRow.original_price) : undefined,
        category: productRow.category,
        inStock: productRow.in_stock,
        rating: productRow.rating ? Number(productRow.rating) : undefined,
        reviews: productRow.reviews_count ?? undefined,
        badge: undefined,
        features: [],
        images,
      });
      setSelectedImage(0);
      setLoadingProduct(false);
    };

    load();
  }, [id]);

  if (loadingProduct) return <div className="container mx-auto px-4 py-10 text-center text-muted-foreground min-h-[50vh] flex items-center justify-center">جاري التحميل...</div>;

  if (productError) {
    return (
      <div className="container mx-auto px-4 py-10 min-h-[50vh] flex items-center justify-center">
        <div className="max-w-2xl mx-auto rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-center w-full">
          <p className="text-sm text-destructive mb-4">
            خطأ في تحميل المنتج من Supabase: {productError}
          </p>
          <Button asChild>
            <Link to="/">العودة للمنتجات</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!product) return <div className="container mx-auto px-4 py-10 text-muted-foreground text-center min-h-[50vh] flex items-center justify-center">لا يوجد منتج.</div>;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground pl-0 group mb-2 inline-flex" dir="rtl">
            <Link to="/">
               العودة إلى المنتجات
              <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            </Link>
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14">
          
          {/* Images on Mobile (Top) - Right/Second column on Desktop */}
          <div className="space-y-6 lg:order-2 order-1">
            {/* Images Carousel */}
            <div 
              className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <img
                src={`${product.images[selectedImage]}?width=800&quality=80&format=webp`}
                alt={product.name}
                className="w-full h-full object-contain p-4 transition-transform duration-500"
                width="600"
                height="750"
                fetchPriority={selectedImage === 0 ? "high" : "auto"}
                loading={selectedImage === 0 ? "eager" : "lazy"}
              />
              
              {/* Product Badge / Sale Tag */}
              {product.originalPrice && (
                <div className="absolute top-4 right-4 z-10 bg-red-600 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-lg">
                  الأكثر مبيعاً
                </div>
              )}
              
              {/* Navigation Arrows */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0ea5e9] bg-white/80 hover:bg-white backdrop-blur-sm h-10 w-10 rounded-full shadow-md transition-all opacity-80 hover:opacity-100 z-10"
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0ea5e9] bg-white/80 hover:bg-white backdrop-blur-sm h-10 w-10 rounded-full shadow-md transition-all opacity-80 hover:opacity-100 z-10"
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Dots Indicator */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      selectedImage === index ? "bg-[#0ea5e9] w-4" : "bg-gray-400 w-1.5 hover:bg-gray-600"
                    }`}
                    aria-label={`View image ${index + 1}`}
                    aria-current={selectedImage === index ? "true" : "false"}
                  />
                ))}
              </div>
            </div>

            {/* Title & Info on Desktop (Below image) just like image 3 */}
            <div className="hidden lg:block space-y-4 text-center" dir="rtl">
               <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
               {product.description && (
                 <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">{product.description}</p>
               )}
            </div>
            
            <div className="hidden lg:block space-y-6" dir="rtl">
              {product.features.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg text-right">لماذا تختار هذا المنتج؟</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 justify-end text-right">
                        <span className="text-gray-600 leading-relaxed flex-1">{feature}</span>
                        <div className="mt-1 bg-green-100 p-1 rounded-full shrink-0">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Form & Price on Mobile (Bottom) - Left/First column on Desktop */}
          <div className="lg:order-1 order-2 flex flex-col pt-0 lg:pt-4">
             {/* Title & Price above the form (visible always) */}
             <div className="flex flex-col items-center lg:items-end w-full mb-6" dir="rtl">
                {/* On mobile, title might be shown here */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4 lg:hidden">{product.name}</h1>
                
                <div className="flex flex-row-reverse items-center justify-end w-full gap-4">
                  <span className="text-4xl md:text-5xl font-black text-[#0ea5e9]">
                    DA {product.price.toLocaleString("fr-DZ")} 
                  </span>
                  
                  {product.originalPrice && (
                    <div className="flex items-center gap-2">
                       <span className="text-xl md:text-2xl text-gray-400 line-through decoration-gray-300 decoration-2 font-semibold">
                         DA {product.originalPrice.toLocaleString("fr-DZ")} 
                       </span>
                       <span className="bg-[#f87171] text-white px-3 py-1 rounded-full text-sm md:text-base font-bold shadow-sm">
                         تخفيض {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                       </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-4 text-gray-600 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm text-sm font-medium">
                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                   <span>{product.rating ?? "4.9"} ( تقييم {product.reviews ?? "240"} )</span>
                </div>
             </div>

             {/* The new Checkout Form */}
             <div className="w-full">
                <CheckoutForm product={product} />
             </div>

             {/* Mobile Description (Visible only on mobile) */}
             <div className="lg:hidden mt-8 space-y-6" dir="rtl">
                {product.description && (
                  <p className="text-base text-gray-600 leading-relaxed text-right">
                    {product.description}
                  </p>
                )}
                
                {product.features.length > 0 && (
                  <div className="bg-white p-5 border border-gray-100 shadow-sm rounded-xl">
                    <ul className="space-y-3">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 justify-end text-right">
                          <span className="text-gray-600">{feature}</span>
                          <Check className="h-5 w-5 text-green-500 shrink-0" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>
      
      {/* Testimonials Section */}
      <TestimonialsDemo />
      
      {/* Customer Reviews Images */}
      <CustomerReviews />
    </div>
  );
};

export default ProductDetail;
