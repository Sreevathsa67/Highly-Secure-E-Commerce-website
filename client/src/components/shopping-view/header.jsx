import { Heart, LogOut, Menu, Mic, Search, ShoppingBag, User, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { logoutUser } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { useToast } from "@/components/ui/use-toast";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
        getCurrentMenuItem.id !== "products" &&
        getCurrentMenuItem.id !== "search"
        ? {
          category: [getCurrentMenuItem.id],
        }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
        new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
      )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer hover:text-rose-500 transition-colors"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function ShoppingHeader() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Get the correct cart items count from the cart state
  const totalCartItems = cartItems?.items?.length || 0;

  // Voice recognition setup
  const recognition =
    "webkitSpeechRecognition" in window
      ? new webkitSpeechRecognition()
      : null;

  // Start/Stop voice recognition
  const toggleVoiceRecognition = () => {
    if (!recognition) {
      toast({
        title: "Voice recognition not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setSearchTerm(spokenText);
        handleSearchSubmit(null, spokenText);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice recognition error. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  };

  function handleLogout() {
    dispatch(logoutUser());
  }

  function handleSearchSubmit(e, voiceText = null) {
    if (e) e.preventDefault();
    
    const term = voiceText || searchTerm;
    if (term && term.trim()) {
      navigate(`/shop/search?keyword=${encodeURIComponent(term.trim())}`);
    }
  }

  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white shadow-md py-2" 
          : "bg-white/95 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {}
          <div className="flex items-center gap-4">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-60">
                  <Link to="/shop/home" className="flex items-center mb-6">
                    <h1 className="text-2xl font-bold text-rose-500">
                      Shopper<span className="text-gray-900">Spot</span>
                    </h1>
                  </Link>
                  <MenuItems />
                </SheetContent>
              </Sheet>
            )}
            
            {}
            <Link to="/shop/home" className="flex items-center">
              <h1 className="text-2xl font-bold text-rose-500">
                Shopper<span className="text-gray-900">Spot</span>
              </h1>
            </Link>
          </div>
          
          {}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-6">
              <MenuItems />
            </nav>
          )}
          
          {}
          <div className="hidden md:flex relative w-1/3">
            <div className="w-full flex items-center gap-2">
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pr-10 w-full rounded-full border-gray-300 focus:border-rose-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                >
                  <Search className="h-4 w-4 text-gray-500" />
                </Button>
              </form>
              <Button
                onClick={toggleVoiceRecognition}
                className={`rounded-full p-2 ${isListening ? "bg-red-500" : "bg-blue-500"} text-white`}
                size="icon"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center gap-2">
            {}
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5 text-gray-600" />
            </Button>
            
            {}
            <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5 text-gray-600" />
                  {totalCartItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-rose-500 text-white rounded-full">
                      {totalCartItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <UserCartWrapper 
                cartItems={cartItems?.items || []} 
                setOpenCartSheet={setOpenCartSheet} 
              />
            </Sheet>
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="bg-gray-800 cursor-pointer">
                  <AvatarFallback className="bg-gray-800 text-white font-semibold">
                    {user?.userName ? user.userName[0].toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user?.userName ? `Hi, ${user.userName}` : "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/shop/account" className="cursor-pointer flex items-center">
                    <UserCog className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/shop/account?tab=orders" className="cursor-pointer flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-rose-600 flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {}
        {isMobile && (
          <div className="mt-3 flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Input
                type="search"
                placeholder="Search products..."
                className="pr-10 w-full rounded-full border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
              >
                <Search className="h-4 w-4 text-gray-500" />
              </Button>
            </form>
            <Button
              onClick={toggleVoiceRecognition}
              className={`rounded-full p-2 ${isListening ? "bg-red-500" : "bg-blue-500"} text-white`}
              size="icon"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default ShoppingHeader;