import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    body: "Fintracker has completely transformed how we manage our company finances. The insights we get are incredible, and the time we save is invaluable. It's like having a CFO in your pocket.",
    author: {
      name: 'Sarah Chen',
      handle: 'CEO, TechFlow',
      imageUrl: 'https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    },
  },
  {
    body: "The automation features in Fintracker are game-changing. We've reduced our monthly financial reconciliation time by 80% and caught expense anomalies we would have missed otherwise.",
    author: {
      name: 'Marcus Rodriguez',
      handle: 'CFO, GrowthLab',
      imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    },
  },
  {
    body: "As a startup founder, having clear visibility into our burn rate and runway is critical. Fintracker makes it so easy to track and forecast our financial health.",
    author: {
      name: 'Emily Davis',
      handle: 'Founder, InnovateCo',
      imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    },
  },
];

export function TestimonialsSection() {
  return (
    <div className="bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by finance teams everywhere
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, testimonialIdx) => (
              <div
                key={testimonialIdx}
                className="flex flex-col justify-between bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow group"
              >
                <div>
                  <div className="flex items-center gap-x-1 text-accent mb-6">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <Star
                        key={rating}
                        className="h-5 w-5 fill-current"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
                    <blockquote className="text-base leading-7 text-foreground relative z-10">
                      <p>"{testimonial.body}"</p>
                    </blockquote>
                  </div>
                </div>
                <figcaption className="mt-8 flex items-center gap-x-4">
                  <img
                    className="h-12 w-12 rounded-full bg-muted object-cover"
                    src={testimonial.author.imageUrl}
                    alt=""
                  />
                  <div className="text-sm leading-6">
                    <div className="font-semibold text-foreground">{testimonial.author.name}</div>
                    <div className="text-muted-foreground">{testimonial.author.handle}</div>
                  </div>
                </figcaption>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}