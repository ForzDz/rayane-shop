import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Star, X } from "lucide-react";
import avis2 from "@/assets/avis2.jpg";
import avis3 from "@/assets/avis3.jpg";
import avis4 from "@/assets/avis4.jpg";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface CustomerReviewsProps {
  productId?: string;
}

export const CustomerReviews = ({ productId }: CustomerReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Hardcoded screenshot reviews (kept as photo testimonials)
  const photoReviews = [
    { id: 1, image: avis2, alt: "تعليق العميل 1" },
    { id: 2, image: avis4, alt: "تعليق العميل 2" },
    { id: 3, image: avis3, alt: "تعليق العميل 3" },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      let query = supabase
        .from("reviews")
        .select("id, customer_name, rating, comment, created_at")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(20);

      if (productId) {
        query = query.eq("product_id", productId);
      }

      const { data, error } = await query;

      if (!error && data) {
        setReviews(data);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [productId]);

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "اليوم";
    if (days === 1) return "أمس";
    if (days < 7) return `منذ ${days} أيام`;
    if (days < 30) return `منذ ${Math.floor(days / 7)} أسابيع`;
    return `منذ ${Math.floor(days / 30)} أشهر`;
  };

  return (
    <>
      <section className="bg-background py-8 md:py-12" dir="rtl">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            آراء عملائنا
          </h2>

          {/* Dynamic text reviews from Supabase */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-muted-foreground">جاري تحميل التقييمات...</div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {review.customer_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{review.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(review.created_at)}</p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : null}

          {/* Photo testimonials (original screenshots) */}
          <div className="flex flex-col gap-4 md:gap-6 items-center">
            {photoReviews.map((review) => (
              <div
                key={review.id}
                className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border hover:shadow-2xl transition-all duration-300 cursor-pointer w-80"
                onClick={() => setSelectedImage(review.image)}
              >
                <img
                  src={review.image}
                  alt={review.alt}
                  className="w-full h-full object-cover rounded-3xl"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={selectedImage}
            alt="Vue agrandie"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
