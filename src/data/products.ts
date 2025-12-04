import { Product, Category } from "@/types/product";
import productImage1 from "@/assets/1.jpg";
import productImage2 from "@/assets/product-secret-lift-2.jpg";
import productImage3 from "@/assets/product-secret-lift-3.png";
import beforeAfter from "@/assets/product-before-after.jpeg";
import ProductImageNew from "@/assets/2.jpg";

export const categories: Category[] = [
  { id: "1", name: "الجمال والعناية", slug: "beaute-soins", icon: "Sparkles", image: productImage1 },
  { id: "2", name: "الصحة والرفاهية", slug: "sante-bien-etre", icon: "Heart", image: productImage2 },
  { id: "3", name: "إكسسوارات", slug: "accessoires", icon: "Watch", image: productImage3 },
  { id: "4", name: "الموضة", slug: "mode", icon: "Shirt", image: productImage1 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "لاصقات الوجه الأصلية للتجاعيد",
    slug: "secret-lift-instant-face-lift",
    category: "الجمال والعناية",
    price: 1900,
    originalPrice: 2900,
    description: "يوفر Secret Lift الأصلي تأثير رفع فوري للوجه والعيون والرقبة والفك. نتائج مرئية فورًا!",
    features: [
      "تأثير رفع فوري",
      "للوجه والعيون والرقبة والفك",
      "نتائج مضمونة - تبدو أصغر بـ 10 سنوات",
      "يتضمن أشرطة رفع للوجه/العيون/الرقبة/الفك و40 شريط لاصق",
      "100% أصلي",
      "مناسب لجميع أنواع البشرة"
    ],

    images: [productImage1, productImage2, ProductImageNew],
    inStock: true,
    badge: "الأكثر مبيعًا",
    rating: 4.8,
    reviews: 1950
  },
  {
    id: "2",
    name: "Secret Lift - Cheveux Foncés",
    slug: "secret-lift-cheveux-fonces",
    category: "Beauté & Soins",
    price: 4500,
    originalPrice: 6500,
    description: "Secret Lift spécialement conçu pour les cheveux foncés (noir, brun, auburn). Lifting instantané du visage avec des résultats naturels.",
    features: [
      "Parfait pour cheveux foncés",
      "Effet naturel et discret",
      "Lifting instantané du visage",
      "Résultats garantis",
      "100% Original",
      "Facile à appliquer"
    ],
    images: [productImage3, productImage1, beforeAfter],
    inStock: true,
    badge: "Nouveau",
    rating: 4.9,
    reviews: 89
  },
  {
    id: "3",
    name: "Secret Lift - Pack Complet",
    slug: "secret-lift-pack-complet",
    category: "Beauté & Soins",
    price: 8500,
    originalPrice: 12000,
    description: "Pack complet Secret Lift avec tous les accessoires nécessaires pour un lifting parfait du visage, cou et mâchoire.",
    features: [
      "Pack économique",
      "Contenu complet",
      "Bandes multiples incluses",
      "Guide d'utilisation détaillé",
      "100% Original",
      "Meilleur rapport qualité-prix"
    ],
    images: [productImage2, productImage1, productImage3],
    inStock: true,
    badge: "Promo -30%",
    rating: 4.7,
    reviews: 234
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return products.filter(p => 
    p.category.toLowerCase().replace(/\s+/g, '-') === categorySlug
  );
};