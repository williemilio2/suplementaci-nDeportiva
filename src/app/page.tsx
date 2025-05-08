import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import PromoBanner from '../components/PromoBanner';
import HeroBanner from '../components/HeroBanner';
import CategoryContent from '../components/CategoryContent';
import Footer from '../components/footer';
import OfertaDia from '../components/OfertaDelDia';
import ProductListing from '../components/Product-listing.jsx';
import CustomCursor from '../components/customCursor';

export default function Home() {
  return (
    <main>
      <CustomCursor />
      <TopBar />
      <Header />
      <Navigation />
      <PromoBanner />
      <HeroBanner />
      <OfertaDia />
      <CategoryContent />
      <ProductListing />
      <Footer />
    </main>
  );
}