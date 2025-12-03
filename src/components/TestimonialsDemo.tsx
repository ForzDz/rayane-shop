import { Testimonials } from "@/components/ui/testimonials"
import avis1 from "@/assets/avis1.jpg";
import avis2 from "@/assets/avis2.jpg";
import avis3 from "@/assets/avis3.jpg";
import avis4 from "@/assets/avis4.jpg";
import saraProfile from "@/assets/سارة ك..jpg";
import houdaProfile from "@/assets/هدى س..jpg";
import aminaProfile from "@/assets/أمينة ب..jpg";

const testimonials = [
  {
    image: saraProfile,
    text: 'أفضل متجر تعاملت معه. خدمة العملاء راقية والمنتجات فعلاً أصلية. سأطلب مرة أخرى بالتأكيد.',
    name: 'سارة ك.',
    username: '@sarah_skincare',
    social: 'https://www.instagram.com/rayen_shopping/'
  },
  {
    image: houdaProfile,
    text: 'منتج ممتاز وفعال، لاحظت الفرق من أول استعمال. سأقوم بطلب علبة أخرى لأمي.',
    name: 'هدى س.',
    username: '@houda_beauty',
    social: 'https://www.instagram.com/rayen_shopping/'
  },
  {
    image: aminaProfile,
    text: 'جربت لاصقات Secret Lift وكانت النتيجة مذهلة! وجهي يبدو مشدوداً وأصغر سناً. شكراً ريان شوب على المصداقية.',
    name: 'أمينة ب.',
    username: '@amina_beauty_dz',
    social: 'https://www.instagram.com/rayen_shopping/'
  }
];

export function TestimonialsDemo() {
  return (
    <div className="container py-10">
      <Testimonials 
        testimonials={testimonials} 
        title="بعض أراء الزبائن"
        description="نفتخر بثقة أكثر من 10,000 زبون في الجزائر"
        maxDisplayed={3}
      />
    </div>
  )
}
