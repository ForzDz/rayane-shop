-- ============================================
-- 📝 REVIEWS TABLE + RLS POLICIES
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 3. SELECT: Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews"
  ON public.reviews
  FOR SELECT
  USING (is_approved = true);

-- 4. SELECT: Admins can read ALL reviews (for moderation)
CREATE POLICY "Admins can read all reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.role = 'staff')
    )
  );

-- 5. INSERT: Anyone can submit a review
CREATE POLICY "Anyone can submit a review"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);

-- 6. UPDATE: Only admin can approve/reject
CREATE POLICY "Admins can update reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.role = 'staff')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.role = 'staff')
    )
  );

-- 7. DELETE: Only admin can delete reviews
CREATE POLICY "Admins can delete reviews"
  ON public.reviews
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.role = 'staff')
    )
  );

-- 8. Index for fast product-scoped queries
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved
  ON public.reviews (product_id, is_approved);
