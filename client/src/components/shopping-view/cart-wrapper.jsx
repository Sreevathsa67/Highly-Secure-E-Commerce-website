import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ShoppingBag, X } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  
  // Ensure cartItems is an array
  const items = Array.isArray(cartItems) ? cartItems : [];

  // Calculate total cart amount
  const totalCartAmount = items.reduce(
    (sum, currentItem) => 
      sum + 
      (currentItem?.salePrice > 0 
        ? currentItem?.salePrice 
        : currentItem?.price) * 
      currentItem?.quantity,
    0
  );

  const handleCheckout = () => {
    setOpenCartSheet(false);
    navigate("/shop/checkout");
  };

  return (
    <SheetContent className="sm:max-w-md border-l border-gray-200">
      <SheetHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <SheetTitle className="text-xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Your Cart 
          <span className="text-sm font-normal text-gray-500">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </SheetTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setOpenCartSheet(false)}
          className="rounded-full h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </SheetHeader>
      
      <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
        {items.length > 0 ? (
          <>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
              {items.map((item) => (
                <UserCartItemsContent
                  key={item.productId || item._id}
                  cartItem={item}
                />
              ))}
            </div>
            
            <div className="mt-auto pt-4 border-t">
              <div className="flex justify-between items-center mb-3 text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${totalCartAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center mb-6 text-lg font-bold">
                <span>Total</span>
                <span>${totalCartAmount.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-6"
                >
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOpenCartSheet(false)}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
            <Button 
              onClick={() => {
                setOpenCartSheet(false);
                navigate("/shop/listing");
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white font-medium"
            >
              Browse Products
            </Button>
          </div>
        )}
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;