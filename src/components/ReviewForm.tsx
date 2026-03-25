import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Star, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  productId: string;
}

export const ReviewForm = ({ productId }: ReviewFormProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({ title: "خطأ", description: "يرجى اختيار تقييم", variant: "destructive" });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      customer_name: name.trim(),
      rating,
      comment: comment.trim(),
    });

    setLoading(false);

    if (error) {
      console.error("Review submit error:", error);
      toast({ title: "خطأ", description: "حدث خطأ، حاول مرة أخرى", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "شكراً! ✅", description: "سيتم نشر تقييمك بعد المراجعة" });
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center" dir="rtl">
        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
        <h3 className="font-bold text-green-800 text-lg mb-1">شكراً لتقييمك!</h3>
        <p className="text-green-600 text-sm">سيتم نشر تقييمك بعد مراجعته من طرف الإدارة.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-5 md:p-6 space-y-4" dir="rtl">
      <h3 className="font-bold text-lg text-gray-900">أضف تقييمك</h3>

      {/* Star Rating */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700 block">التقييم</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-0.5 transition-transform hover:scale-110"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="review-name" className="text-sm font-semibold text-gray-700 block">اسمك</label>
        <Input
          id="review-name"
          required
          placeholder="أدخل اسمك"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-[#0ea5e9] text-right"
        />
      </div>

      {/* Comment */}
      <div className="space-y-1.5">
        <label htmlFor="review-comment" className="text-sm font-semibold text-gray-700 block">تعليقك</label>
        <textarea
          id="review-comment"
          required
          placeholder="شاركنا رأيك حول هذا المنتج..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm text-right focus:bg-white focus:border-[#0ea5e9] focus:outline-none focus:ring-1 focus:ring-[#0ea5e9] resize-none transition-colors"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-xl bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white font-bold"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
            جاري الإرسال...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 ml-2" />
            إرسال التقييم
          </>
        )}
      </Button>
    </form>
  );
};
