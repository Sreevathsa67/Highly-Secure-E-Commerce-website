import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/bcd.webp";
import bannerTwo from "../../assets/ab.jpg";
import bannerThree from "../../assets/cc.jpg";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

import nike from "../../assets/nike.jpg";
import addidas from "../../assets/adiidas.png";
import levis from "../../assets/levis.jpg";
import hnm from "../../assets/hnm.png";
import puma from "../../assets/puma.png";
import zara from "../../assets/zara.jpg";


const banners = [bannerOne, bannerTwo, bannerThree];

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", image: nike },
  { id: "adidas", label: "Adidas", image: addidas },
  { id: "puma", label: "Puma", image: puma },
  { id: "levi", label: "Levi's", image: levis },
  { id: "zara", label: "Zara", image: zara },
  { id: "h&m", label: "H&M", image: hnm },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const sliderRef = useRef(null);
  
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product added to cart successfully",
          description: "You can view your items in the cart",
          variant: "success",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  
  useEffect(() => {
    let timer;
    if (!isSliderPaused) {
      timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
      }, 5000); 
    }
    return () => clearInterval(timer);
  }, [isSliderPaused]);

  
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );  
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {}
      <div 
        className="relative w-full h-[500px] md:h-[600px] overflow-hidden"
        onMouseEnter={() => setIsSliderPaused(true)}
        onMouseLeave={() => setIsSliderPaused(false)}
        ref={sliderRef}
      >
        {banners.map((banner, index) => (
          <div 
            key={index} 
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={banner}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-lg">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {index === 0 && "Summer Collection"}
                    {index === 1 && "New Arrivals"}
                    {index === 2 && "Special Offers"}
                  </h1>
                  <p className="text-white text-lg mb-6">
                    {index === 0 && "Shop the latest trends for the summer season"}
                    {index === 1 && "Discover our newest arrivals just for you"}
                    {index === 2 && "Limited time discounts on selected items"}
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-white text-black hover:bg-gray-200 flex items-center gap-2"
                    onClick={() => navigate('/shop/listing')}
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index 
                  ? "bg-white" 
                  : "bg-white/50 hover:bg-white/80"
              } transition-all`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + banners.length) % banners.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white z-20 rounded-full"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white z-20 rounded-full"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {}
      <section className="py-12 bg-gradient-to-r from-[#f1f1f1] via-[#5c4c44] to-[#3e3d3b]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-white font-sans">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 bg-white/90 backdrop-blur border border-white/20"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                    <categoryItem.icon className="w-8 h-8 [#3e3d3b]" />
                  </div>
                  <span className="font-medium text-gray-800">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Brand Section - Improved Layout */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 font-sans">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden"
              >
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <div className="w-full h-20 flex items-center justify-center mb-3 overflow-hidden">
                    <img 
                      src={brandItem.image} 
                      alt={brandItem.label} 
                      className="w-auto h-16 object-contain transition-transform hover:scale-110" 
                    />
                  </div>
                  <span className="font-medium text-gray-700">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Products Section - Improved Grid and Animations */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Featured Products
            </h2>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/shop/listing')}
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          {productList.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productList.map((productItem) => (
                <div 
                  key={productItem.id} 
                  className="transition-all hover:-translate-y-1 duration-300"
                >
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;