import { useState } from "react";
import { products } from "@/data/products";
import { CheckoutForm } from "@/components/CheckoutForm";
import { CustomerReviews } from "@/components/CustomerReviews";
import { TestimonialsDemo } from "@/components/TestimonialsDemo";
import { Badge } from "@/components/ui/badge";
import { Star, Check, ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const product = products[0]; // Secret Lift
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
      // Swipe Left -> Next Image
      nextImage();
    }
    if (isRightSwipe) {
      // Swipe Right -> Previous Image
      prevImage();
    }
  };

  if (!product) return <div>جاري التحميل...</div>;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Product Title & Rating (Mobile & Desktop) */}
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {product.name}
            <span className="inline-flex items-center gap-2 mr-3 align-middle">
              <span className="text-2xl font-bold text-black">+ مع هدية</span>
              <Gift className="h-7 w-7 text-primary animate-bounce" />
            </span>
          </h1>
          
          
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-lg border border-primary/20">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="font-bold text-lg text-foreground">{product.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">{product.reviews}</span>
              <span className="text-xs text-muted-foreground">تقييم موثوق</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Product Images & Details */}
          <div className="space-y-8">
            {/* Images Carousel */}
            <div 
              className="relative aspect-square bg-accent rounded-2xl overflow-hidden shadow-sm group touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500"
                width="600"
                height="600"
                fetchPriority={selectedImage === 0 ? "high" : "auto"}
                loading={selectedImage === 0 ? "eager" : "lazy"}
              />
              {product.badge && (
                <Badge className="absolute top-4 right-4 text-lg px-4 py-1 z-10" variant="destructive">
                  {product.badge}
                </Badge>
              )}
              
              {/* Navigation Arrows */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-primary bg-white/20 hover:bg-white/40 backdrop-blur-sm h-12 w-12 rounded-full animate-bounce-left z-10"
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary bg-white/20 hover:bg-white/40 backdrop-blur-sm h-12 w-12 rounded-full animate-bounce-right z-10"
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedImage === index ? "bg-primary w-4" : "bg-white/60 hover:bg-white"
                    }`}
                    aria-label={`View image ${index + 1}`}
                    aria-current={selectedImage === index ? "true" : "false"}
                  />
                ))}
              </div>
            </div>

            {/* Product Info (Mobile: Hidden, shown below title) */}
            <div className="hidden lg:block space-y-6">
              <div className="prose prose-lg text-muted-foreground">
                <p>{product.description}</p>
              </div>
              
              <div className="bg-accent/30 p-6 rounded-xl">
                <h3 className="font-semibold text-foreground mb-4 text-lg">لماذا تختار هذا المنتج؟</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 bg-primary/10 p-1 rounded-full">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Price & Checkout Form */}
          <div className="space-y-8">
            <div>

              <div className="flex flex-wrap items-baseline gap-4 mb-6">
                <span className="text-5xl font-bold text-primary">
                  {product.price.toLocaleString()} DA
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-muted-foreground line-through decoration-2 decoration-destructive/50">
                      {product.originalPrice.toLocaleString()} DA
                    </span>
                    <Badge variant="destructive" className="text-lg px-3 py-1 animate-pulse">
                      تخفيض {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  </>
                )}
              </div>



              {/* Checkout Form */}
              <div id="order-form" className="scroll-mt-24">
                <CheckoutForm product={product} />
              </div>

              {/* Mobile Description (Visible only on mobile) */}
              <div className="lg:hidden mt-8 space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <div className="bg-accent/30 p-5 rounded-xl">
                  <ul className="space-y-3">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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

export default Home;