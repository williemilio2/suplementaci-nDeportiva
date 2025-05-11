
import PromoBanner from '../components/PromoBanner';
import HeroBanner from '../components/HeroBanner';
import CategoryContent from '../components/CategoryContent';
import OfertaDia from '../components/OfertaDelDia';
import ProductListing from '../components/Product-listing';
import CustomCursor from '../components/customCursor';

export default function Home() {
  return (
    <main>
      <CustomCursor />
      <PromoBanner />
      <HeroBanner />
      <OfertaDia />
      <CategoryContent />
      <ProductListing />
    </main>
  );
}