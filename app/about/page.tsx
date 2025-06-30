import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AboutSection } from '@/components/sections/about-section';

export const metadata = {
  title: 'About - Fintracker',
  description: 'Learn about our mission to revolutionize financial management for digital businesses.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}