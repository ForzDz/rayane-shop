import { cva } from "class-variance-authority"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface StarRatingProps {
  ratingScale: number
  value?: number
  readonly?: boolean
  size?: "sm" | "md" | "lg"
  onRatingChange?: (rating: number) => void
}

const starRatingVariants = cva("transition-all duration-150", {
  variants: {
    size: {
      sm: "size-3.5",
      md: "size-5",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export function StarRating({
  ratingScale,
  readonly,
  size = "md",
  onRatingChange,
  value,
  className,
  ...props
}: React.ComponentProps<"svg"> & StarRatingProps) {
  const onRatingChangeHandler = (index: number) => {
    if (readonly) {
      return
    }

    onRatingChange?.(index + 1)
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: ratingScale }).map((_, index) => {
        const isFilled = value && index < Math.floor(value);
        const isHalfFilled = value && index === Math.floor(value) && value % 1 !== 0;
        
        return (
          <div key={index} className="relative">
            <Star
              role="button"
              onClick={() => onRatingChangeHandler(index)}
              data-slot="star"
              type="button"
              className={cn(
                starRatingVariants({ size }),
                {
                  "fill-current": isFilled,
                  "cursor-pointer hover:scale-110": !readonly,
                },
                className,
              )}
              {...props}
            />
            {isHalfFilled && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <Star
                  className={cn(
                    starRatingVariants({ size }),
                    "fill-current",
                    className,
                  )}
                  {...props}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  )
}
