import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PricingSection } from '@/components/sections/pricing-section';

export const metadata = {
  title: 'Pricing - Fintracker',
  description: 'Choose the perfect plan for your business. Transparent pricing with no hidden fees.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}