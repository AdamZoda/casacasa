import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { Brands } from "../components/Brands";
import { Testimonials } from "../components/Testimonials";
import { JournalTeaser } from "../components/JournalTeaser";
import { StoreTeaser } from "../components/StoreTeaser";
import { Newsletter } from "../components/Newsletter";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { RandomActivityConcept } from "../components/RandomActivityConcept";

export function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <FeaturedCarousel />
      <RandomActivityConcept />
      <Services />
      <JournalTeaser />
      <StoreTeaser />
      <Testimonials />
      <Newsletter />
    </>
  );
}
