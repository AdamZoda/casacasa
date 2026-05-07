import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { Brands } from "../components/Brands";
import { Testimonials } from "../components/Testimonials";
import { JournalTeaser } from "../components/JournalTeaser";
import { StoreTeaser } from "../components/StoreTeaser";
import { Newsletter } from "../components/Newsletter";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { RandomActivityConcept } from "../components/RandomActivityConcept";
import { useAppContext } from "../context/AppContext";
import { isPathHidden } from "../lib/hiddenPages";

export function Home() {
  const { settings } = useAppContext();
  const hiddenPages = settings.hiddenPages ?? [];

  return (
    <>
      <Hero />
      {!isPathHidden("/brands", hiddenPages) && <Brands />}
      {!isPathHidden("/services", hiddenPages) && (
        <>
          <FeaturedCarousel />
          <RandomActivityConcept />
          <Services />
        </>
      )}
      {!isPathHidden("/journal", hiddenPages) && <JournalTeaser />}
      {!isPathHidden("/store", hiddenPages) && <StoreTeaser />}
      <Testimonials />
      <Newsletter />
    </>
  );
}
