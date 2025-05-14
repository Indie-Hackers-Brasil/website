import { CTASection } from "@/components/organisms/cta-section";
import { FeaturedProjects } from "@/components/organisms/featured-projects";
import { FeaturesSection } from "@/components/organisms/features-section";
import { HeroSection } from "@/components/organisms/hero-section";
import { ParallaxBackground } from "@/components/organisms/parallax-background";
import { TestimonialsSection } from "@/components/organisms/testimonials-section";

export default function Home() {
  return (
    <>
      <ParallaxBackground />
      <main className="flex flex-col relative z-0">
        <HeroSection />
        <FeaturesSection />
        <FeaturedProjects />
        <TestimonialsSection />
        <CTASection />
      </main>
    </>
  );
}
