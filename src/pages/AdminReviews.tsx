import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, XCircle, Loader2, MessageSquare, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  products?: { name: string } | null;
}

const AdminReviews = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*, products(name)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data as Review[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: true })
      .eq("id", id);

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ تم الموافقة", description: "تم نشر التقييم بنجاح" });
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_approved: true } : r)));
    }
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "🗑️ تم الحذف", description: "تم حذف التقييم" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
    setActionLoading(null);
  };

  const handleUnapprove = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: false })
      .eq("id", id);

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "⏸️ تم الإلغاء", description: "تم إخفاء التقييم" });
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_approved: false } : r)));
    }
    setActionLoading(null);
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "pending") return !r.is_approved;
    if (filter === "approved") return r.is_approved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">إدارة التقييمات</h1>
          <p className="text-muted-foreground text-sm">
            الموافقة على تقييمات العملاء أو حذفها.
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="destructive" className="text-sm px-3 py-1">
            {pendingCount} بانتظار المراجعة
          </Badge>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "approved"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "all" && `الكل (${reviews.length})`}
            {tab === "pending" && `في الانتظار (${pendingCount})`}
            {tab === "approved" && `منشور (${reviews.filter((r) => r.is_approved).length})`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-24 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">لا توجد تقييمات في هذا القسم.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <Card
              key={review.id}
              className={`p-4 transition-colors ${
                !review.is_approved ? "border-amber-200 bg-amber-50/30" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {review.customer_name.charAt(0)}
                    </div>
                    <span className="font-semibold text-sm">{review.customer_name}</span>
                    {renderStars(review.rating)}
                    <Badge variant={review.is_approved ? "default" : "outline"} className="text-xs">
                      {review.is_approved ? "منشور" : "في الانتظار"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>المنتج: {review.products?.name || "غير معروف"}</span>
                    <span>•</span>
                    <span>{new Date(review.created_at).toLocaleDateString("ar-DZ")}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 shrink-0">
                  {!review.is_approved ? (
                    <Button
                      size="sm"
                      variant="default"
                      disabled={actionLoading === review.id}
                      onClick={() => handleApprove(review.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {actionLoading === review.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionLoading === review.id}
                      onClick={() => handleUnapprove(review.id)}
                    >
                      {actionLoading === review.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={actionLoading === review.id}
                    onClick={() => handleReject(review.id)}
                  >
                    {actionLoading === review.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
