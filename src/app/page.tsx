// src/app/page.tsx (Ana sayfa)
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section id="home" className="min-h-screen">
          <Hero />
        </section>  
        <section id="how-it-works" className="py-20 bg-slate-50">
          <HowItWorks />
        </section>     
        <section id="testimonials" className="py-20">
          <Testimonials />
        </section>
      </main>
      <Footer />
    </>
  );
}