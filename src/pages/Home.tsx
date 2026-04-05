import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { Brands } from "../components/Brands";
import { Testimonials } from "../components/Testimonials";
import { JournalTeaser } from "../components/JournalTeaser";
import { StoreTeaser } from "../components/StoreTeaser";
import { Newsletter } from "../components/Newsletter";

export function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <Services />
      <JournalTeaser />
      <StoreTeaser />
      <Testimonials />
      <Newsletter />
    </>
  );
}
