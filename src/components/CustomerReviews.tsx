import { useState } from "react";
import avis2 from "@/assets/avis2.jpg";
import avis3 from "@/assets/avis3.jpg";
import avis4 from "@/assets/avis4.jpg";
import { X } from "lucide-react";

export const CustomerReviews = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const reviews = [
    { id: 1, image: avis2, alt: "تعليق العميل 1" },
    { id: 2, image: avis4, alt: "تعليق العميل 2" },
    { id: 3, image: avis3, alt: "تعليق العميل 3" }
  ];

  return (
    <>
      <section className="bg-background py-8 md:py-12">
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex flex-col gap-4 md:gap-6 items-center">
            {reviews.map((review) => (
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
