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
      orderStatus: "Pending", 
      paymentMethod: "Paypal", 
      paymentStatus: "Pending", 
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

          {}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {}
          <div className="mt-4 w-full">
            <Button onClick={handlePayPalCheckout} className="w-full gap-2">
              {isProcessingPayment
                ? "Processing Payment..."
                : "Checkout with "}
                 <img src="/p.png" alt="PayPal" className="h-12" />
            </Button>
         <p> <br></br>
         </p>
         
            <Button
  onClick={async () => {
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

    const orderDetails = {
      userId: user?.id,
      cartId: cartItems?._id || null,
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
      orderStatus: "Pending",
      paymentMethod: "Stripe",
      paymentStatus: "Pending",
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "", 
      payerId: "",
    };

    
    const orderRes = await fetch("http://localhost:5000/api/shop/order/stripe-init-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderDetails),
    });

    const savedOrder = await orderRes.json();

    if (!savedOrder.success || !savedOrder.orderId) {
      toast({ title: "Failed to create order before Stripe", variant: "destructive" });
      return;
    }

    
    const res = await fetch("http://localhost:5000/api/shop/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: savedOrder.orderId,
        cartItems: cartItems.items,
      }),
    });

    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    } else {
      toast({ title: "Stripe session creation failed", variant: "destructive" });
    }
  }}
   className="w-full gap-2"
>


  Checkout with  <img src="/s.png" alt="PayPal" className="h-6" />
</Button>


          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
