import { HeroSection } from '@/sections/home/HeroSection';
import { StatsBar } from '@/sections/home/StatsBar';
import { CategoriesSection } from '@/sections/home/CategoriesSection';
import { FeaturedServices } from '@/sections/home/FeaturedServices';
import { HowItWorks } from '@/sections/home/HowItWorks';
import { FreelancerCTA } from '@/sections/home/FreelancerCTA';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsBar />
      <CategoriesSection />
      <FeaturedServices />
      <HowItWorks />
      <FreelancerCTA />
    </main>
  );
}
