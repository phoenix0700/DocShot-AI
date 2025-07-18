import { Metadata } from 'next';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { HeroSection } from '../components/marketing/HeroSection';
import { FeaturesSection } from '../components/marketing/FeaturesSection';
import { PricingSection } from '../components/marketing/PricingSection';
import { TestimonialsSection } from '../components/marketing/TestimonialsSection';
import { FAQSection } from '../components/marketing/FAQSection';
import { CTASection } from '../components/marketing/CTASection';
import { Footer } from '../components/marketing/Footer';
import { Header } from '../components/marketing/Header';

export const metadata: Metadata = {
  title: 'DocShot AI - Automated Screenshot Management for Documentation',
  description:
    'Keep your documentation visually up-to-date with zero manual effort. Automatically capture, update, and manage screenshots in your docs, help centers, and release notes.',
  keywords:
    'screenshot automation, documentation, visual testing, automated screenshots, docs management',
  openGraph: {
    title: 'DocShot AI - Automated Screenshot Management',
    description:
      'Automatically capture and update screenshots in your documentation with AI-powered visual change detection.',
    url: 'https://docshot.ai',
    siteName: 'DocShot AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocShot AI - Automated Screenshot Management',
    description: 'Keep your documentation visually up-to-date with zero manual effort.',
  },
};

export default function HomePage() {
  const { userId } = auth();

  // If user is already signed in, redirect to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
