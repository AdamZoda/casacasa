import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { Brands } from "../components/Brands";
import { Testimonials } from "../components/Testimonials";

export function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <Services />
      <Testimonials />
    </>
  );
}
