// import { Button } from "@/components/ui/button";
// import {
//   ArrowRight,
//   CheckCircle,
//   TrendingUp,
//   Clock,
//   DollarSign,
// } from "lucide-react";
// import Link from "next/link";

// const benefits = [
//   {
//     icon: Clock,
//     text: "Save 15+ hours per week",
//   },
//   {
//     icon: TrendingUp,
//     text: "Increase ROI by 34% on average",
//   },
//   {
//     icon: DollarSign,
//     text: "Track $50M+ in revenue",
//   },
//   {
//     icon: CheckCircle,
//     text: "14-day free trial",
//   },
// ];

// export function CTASection() {
//   return (
//     <div className="bg-background">
//       <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
//         <div className="relative isolate overflow-hidden gradient-primary px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
//           <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
//             Still have questions?
//           </h2>
//           <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/90">
//             Our team is here to help you get the most out of FinTracker.
//           </p>
//           <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
//             <Link href="/pricing">
//               <Button
//                 size="lg"
//                 variant="secondary"
//                 className="group px-8 py-4 text-lg font-semibold"
//               >
//                 <span className="flex items-center">
//                   Start Free Trial
//                   <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
//                 </span>
//               </Button>
//             </Link>
//             <Link href="/contact">
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
//               >
//                 Schedule Demo
//               </Button>
//             </Link>
//           </div>
//           <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
//             {benefits.map((benefit, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col items-center text-white/90"
//               >
//                 <benefit.icon className="h-8 w-8 text-white mb-2" />
//                 <span className="text-sm font-medium text-center">
//                   {benefit.text}
//                 </span>
//               </div>
//             ))}
//           </div>
//           <p className="mt-8 text-sm text-white/70">
//             No credit card required • Setup in 15 minutes • Cancel anytime
//           </p>
//           <svg
//             viewBox="0 0 1024 1024"
//             className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
//             aria-hidden="true"
//           >
//             <circle
//               cx={512}
//               cy={512}
//               r={512}
//               fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
//               fillOpacity="0.7"
//             />
//             <defs>
//               <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
//                 <stop stopColor="#3b82f6" />
//                 <stop offset={1} stopColor="#10b981" />
//               </radialGradient>
//             </defs>
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// }
