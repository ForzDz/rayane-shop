import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Trash2 } from "lucide-react";

interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  in_stock: boolean;
  is_active: boolean;
}

interface ProductImage {
  id: string;
  image_url: string;
}

const initialProduct: Product = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  original_price: null,
  category: "",
  in_stock: true,
  is_active: true,
};

export const AdminProductEdit = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product>(initialProduct);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (isNew || !id) return;

      setLoading(true);
      setError(null);

      const { data: productData, error: pError } = await supabase
        .from("products")
        .select("*, product_images(id, image_url)")
        .eq("id", id)
        .single();

      if (pError) {
        setError(pError.message);
      } else if (productData) {
        const { product_images, ...restProduct } = productData as any;
        setProduct(restProduct as Product);
        
        if (product_images) {
          setImages(product_images as ProductImage[]);
        }
      }

      setLoading(false);
    };

    load();
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      let productId = id;

      if (isNew) {
        const { data, error } = await supabase
          .from("products")
          .insert({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            original_price: product.original_price,
            category: product.category,
            in_stock: product.in_stock,
            is_active: product.is_active,
          })
          .select("id")
          .single();

        if (error) throw error;
        productId = data.id as string;
      } else if (id) {
        const { error } = await supabase
          .from("products")
          .update({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            original_price: product.original_price,
            category: product.category,
            in_stock: product.in_stock,
            is_active: product.is_active,
          })
          .eq("id", id);

        if (error) throw error;
      }

      // Upload new images
      if (newImageFiles.length > 0 && productId) {
        for (const file of newImageFiles) {
          const fileExt = file.name.split(".").pop();
          const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          // Canonical path: products/{productId}/{uniqueName}
          const filePath = `products/${productId}/${uniqueName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(filePath, file, { upsert: false });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(uploadData.path);

          if (publicUrlData?.publicUrl) {
            const { error: dbError } = await supabase.from("product_images").insert({
              product_id: productId,
              image_url: publicUrlData.publicUrl,
            });
            if (dbError) throw dbError;
          }
        }
      }

      navigate("/admin/products");
    } catch (e: any) {
      setError(e.message ?? "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const previews = newFiles.map(file => URL.createObjectURL(file));

    setNewImageFiles(prev => [...prev, ...newFiles]);
    setNewImagePreviews(prev => [...prev, ...previews]);
    
    event.target.value = "";
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageId: string, imageUrl: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;
    
    setSaving(true);
    setError(null);
    try {
      // Extract the storage path from the public URL.
      // Public URLs look like: .../storage/v1/object/public/product-images/products/{id}/file.jpg
      const marker = "/object/public/product-images/";
      const markerIndex = imageUrl.indexOf(marker);
      if (markerIndex !== -1) {
        const filePath = imageUrl.slice(markerIndex + marker.length);
        await supabase.storage.from("product-images").remove([filePath]);
      }
      
      const { error } = await supabase.from("product_images").delete().eq("id", imageId);
      if (error) throw error;
      
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err: any) {
      setError("خطأ في حذف الصورة: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {isNew ? "إضافة منتج جديد" : `تعديل المنتج`}
          </h1>
          <p className="text-sm text-muted-foreground">
            إدارة بيانات المنتج والصور المستعملة في صفحة البيع.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="/admin/products">
            <ArrowLeft className="h-4 w-4 ml-1" />
            الرجوع إلى المنتجات
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 space-y-4 md:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                اسم المنتج
              </label>
              <Input
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                placeholder="مثال: لاصقات الوجه الأصلية للتجاعيد"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Slug (رابط قصير)
              </label>
              <Input
                value={product.slug}
                onChange={(e) => setProduct({ ...product, slug: e.target.value })}
                placeholder="مثال: secret-lift-instant-face-lift"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              الوصف
            </label>
            <Textarea
              rows={4}
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              placeholder="وصف تسويقي مفصل للمنتج..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                السعر (DA)
              </label>
              <Input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: Number(e.target.value || 0) })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                السعر الأصلي (DA)
              </label>
              <Input
                type="number"
                value={product.original_price ?? ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    original_price: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                الفئة
              </label>
              <Input
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                placeholder="مثال: الجمال والعناية"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs"
              onClick={() =>
                setProduct((p) => ({ ...p, in_stock: !p.in_stock }))
              }
            >
              <Badge variant={product.in_stock ? "outline" : "destructive"}>
                {product.in_stock ? "متوفر في المخزون" : "غير متوفر"}
              </Badge>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs"
              onClick={() =>
                setProduct((p) => ({ ...p, is_active: !p.is_active }))
              }
            >
              <Badge variant={product.is_active ? "default" : "secondary"}>
                {product.is_active ? "ظاهر في المتجر" : "مخفى"}
              </Badge>
            </button>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              صور المنتج
            </span>
          </div>

          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
            />
          </div>

          {(images.length > 0 || newImagePreviews.length > 0) && (
            <div className="grid grid-cols-2 gap-2">
              {images.map((img) => (
                <div key={img.id} className="relative overflow-hidden rounded-md border bg-muted/40 group">
                  <img src={`${img.image_url}?width=400&quality=70&format=webp`} alt="Product" className="w-full h-24 object-cover" width="100" height="100" loading="lazy" />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(img.id, img.image_url)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {newImagePreviews.map((url, index) => (
                <div key={index} className="relative overflow-hidden rounded-md border bg-muted/40 group">
                  <img src={url} alt="New Preview" className="w-full h-24 object-cover opacity-70" width="100" height="100" loading="lazy" />
                  <div className="absolute top-1 left-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">جديد</Badge>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {!images.length && !newImagePreviews.length && (
            <p className="text-xs text-muted-foreground">لا توجد صور بعد لهذا المنتج.</p>
          )}
        </Card>
      </div>

      <div className="flex items-center justify-end gap-3">
        {error && (
          <p className="text-xs text-destructive flex-1 text-left">
            {error}
          </p>
        )}
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 ml-1 animate-spin" />}
          <Save className="h-4 w-4 ml-1" />
          حفظ المنتج
        </Button>
      </div>
    </div>
  );
};

export default AdminProductEdit;

