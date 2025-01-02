import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';

export default function Home() {
  return (
    <main>
      <section id="home">
      <Hero />
      </section>  
      <section id="how-it-works">
      <HowItWorks />
      </section>     
      <section id="testimonials">
      <Testimonials />
      </section>
    </main>
  );
}