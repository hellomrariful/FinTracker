import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ContactSection } from '@/components/sections/contact-section';

export const metadata = {
  title: 'Contact - Fintracker',
  description: 'Get in touch with our team. We\'re here to help you succeed.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}