"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Instagram } from "lucide-react"
import { StarRating } from "@/components/ui/star-rating"

interface Testimonial {
  image: string
  name: string
  username: string
  text: string
  social: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  className?: string
  title?: string
  description?: string
  maxDisplayed?: number
}

export function Testimonials({
  testimonials,
  className,
  title = "آراء زبائننا",
  description = "اكتشف تجارب زبائننا الحقيقية مع منتجاتنا",
  maxDisplayed = 6,
}: TestimonialsProps) {
  const [showAll, setShowAll] = useState(false)

  const openInNewTab = (url: string) => {
    window.open(url, "_blank")?.focus()
  }

  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center pt-5">
        <div className="flex flex-col gap-5 mb-8">
          <h2 className="text-center text-4xl font-bold text-foreground">{title}</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {description.split("<br />").map((line, i) => (
              <span key={i}>
                {line}
                {i !== description.split("<br />").length - 1 && <br />}
              </span>
            ))}
          </p>
          <div className="flex justify-center mt-4">
            <StarRating 
              ratingScale={5} 
              value={4.5} 
              readonly 
              size="lg" 
              className="text-yellow-400 fill-yellow-400 !size-8" 
              style={{ 
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))',
                stroke: '#000',
                strokeWidth: '1.5px'
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            "flex justify-center items-center gap-5 flex-wrap",
            !showAll &&
              testimonials.length > maxDisplayed &&
              "max-h-[720px] overflow-hidden",
          )}
        >
          {testimonials
            .slice(0, showAll ? undefined : maxDisplayed)
            .map((testimonial, index) => (
              <Card
                key={index}
                className="w-80 h-auto p-5 relative bg-card border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover h-[50px] w-[50px]"
                  />
                  <div className="flex flex-col pr-4">
                    <span className="font-semibold text-base">
                      {testimonial.name}
                    </span>
                    <span className="text-sm text-muted-foreground" dir="ltr">
                      {testimonial.username}
                    </span>
                  </div>
                </div>
                <div className="mt-5 mb-5">
                  <p className="text-foreground font-medium leading-relaxed">
                    {testimonial.text}
                  </p>
                </div>
                <button
                  onClick={() => openInNewTab(testimonial.social)}
                  className="absolute top-4 left-4 hover:opacity-80 transition-opacity text-primary"
                  aria-label="Visit profile"
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </button>
              </Card>
            ))}
        </div>

        {testimonials.length > maxDisplayed && !showAll && (
          <>
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
              <Button variant="secondary" onClick={() => setShowAll(true)}>
                عرض المزيد
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
