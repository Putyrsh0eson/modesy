import { HeroSlider } from "@/components/sites/modesy/hero/HeroSlider";
import { FeaturedCategories } from "@/components/sites/modesy/categories/FeaturedCategories";
import { SpecialOffers } from "@/components/sites/modesy/products/SpecialOffers";
import { PromoBannersTwoCol } from "@/components/sites/modesy/products/PromoBannersTwoCol";
import { FeaturedProducts } from "@/components/sites/modesy/products/FeaturedProducts";
import { PromoBannersThreeCol } from "@/components/sites/modesy/products/PromoBannersThreeCol";
import { NewArrivals } from "@/components/sites/modesy/products/NewArrivals";
import { CategoryProductSlider } from "@/components/sites/modesy/products/CategoryProductSlider";
import { ShopByBrand } from "@/components/sites/modesy/home/ShopByBrand";
import { HomeBlogSection } from "@/components/sites/modesy/home/HomeBlogSection";
import { CLOTHING_PRODUCTS, JEWELRY_PRODUCTS } from "@/data/modesy-mock";

export default function Home() {
  return (
    <div className="flex flex-col bg-white">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Featured Categories Carousel / Grid */}
      <FeaturedCategories />

      {/* Special Offers Products Slider */}
      <SpecialOffers />

      {/* 2-Column Promo Banners */}
      <PromoBannersTwoCol />

      {/* Featured Products Grid */}
      <FeaturedProducts />

      {/* 3-Column Promo Banners */}
      <PromoBannersThreeCol />

      {/* New Arrivals Grid matching Modesy index.php section-latest-products */}
      <NewArrivals />

      {/* Category Products: Clothing Showcase */}
      <CategoryProductSlider
        title="Clothing"
        categorySlug="clothing"
        products={CLOTHING_PRODUCTS}
      />

      {/* Category Products: Jewelry & Accessories Showcase */}
      <CategoryProductSlider
        title="Jewelry & Accessories"
        categorySlug="jewelry-accessories"
        products={JEWELRY_PRODUCTS}
      />

      {/* Shop By Brand */}
      <ShopByBrand />

      {/* Latest Blog Posts */}
      <HomeBlogSection />
    </div>
  );
}
