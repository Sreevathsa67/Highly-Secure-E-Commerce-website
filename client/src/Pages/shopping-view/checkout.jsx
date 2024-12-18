import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Helper function to calculate total amount
  const calculateTotalAmount = () => {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      return 0;
    }
    return cartItems.items.reduce(
      (sum, item) =>
        sum +
        (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
      0
    );
  };

  const totalAmount = calculateTotalAmount();

  // Function to handle PayPal checkout
  const handlePayPalCheckout = () => {
    if (!cartItems || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedAddress) {
      toast({
        title: "Please select an address to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Check if the pincode is valid (6 digits)
    if (!/^\d{6}$/.test(selectedAddress?.pincode)) {
      toast({
        title: "Invalid pincode. Please ensure it has 6 digits.",
        variant: "destructive",
      });
      return;
    }

    const orderDetails = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: selectedAddress?._id,
        address: selectedAddress?.address,
        city: selectedAddress?.city,
        pincode: selectedAddress?.pincode,
        phone: selectedAddress?.phone,
        notes: selectedAddress?.notes,
      },
      orderStatus: "Pending", // Capitalized to match enum
      paymentMethod: "Paypal", // Added to match or extend enum in schema
      paymentStatus: "Pending", // Capitalized to match enum
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    setIsProcessingPayment(true);

    dispatch(createNewOrder(orderDetails)).then((response) => {
      const success = response?.payload?.success;

      if (success) {
        toast({
          title: "Redirecting to PayPal...",
          variant: "default",
        });
        setIsProcessingPayment(false);
      } else {
        toast({
          title: "Failed to initiate payment. Please try again.",
          variant: "destructive",
        });
        setIsProcessingPayment(false);
      }
    });
  };

  // Redirect to PayPal approval URL
  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          alt="Checkout Banner"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        {/* Address Section */}
        <Address
          selectedId={selectedAddress}
          setCurrentSelectedAddress={setSelectedAddress}
        />

        {/* Cart Items Section */}
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            cartItems.items.map((item, index) => (
              <UserCartItemsContent key={index} cartItem={item} />
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}

          {/* Total Amount */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="mt-4 w-full">
            <Button onClick={handlePayPalCheckout} className="w-full">
              {isProcessingPayment
                ? "Processing Payment..."
                : "Checkout with PayPal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
