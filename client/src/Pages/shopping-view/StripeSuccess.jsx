import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function StripeSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = params.get("session_id");
  const orderId = params.get("orderId"); 

  useEffect(() => {
    const verifyStripePayment = async () => {
      if (!sessionId || !orderId) {
        console.error(" Missing sessionId or orderId");
        return;
      }

      try {
        
        const confirmRes = await fetch("http://localhost:5000/api/shop/stripe/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const confirmData = await confirmRes.json();

        if (confirmData.success) {
         
          await fetch("http://localhost:5000/api/shop/order/update-after-stripe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              paymentId: sessionId,
              paymentStatus: "Completed",
            }),
          });

          alert("✅ Payment successful!");
          navigate("/shop/payment-success");
        } else {
          alert(" Stripe payment verification failed");
          navigate("/shop/checkout");
        }
      } catch (err) {
        console.error(" Error during Stripe payment success:", err);
      }
    };

    verifyStripePayment();
  }, [sessionId, orderId, navigate]);

  return (
    <div className="text-center mt-10 text-lg">
      Verifying Stripe payment...
    </div>
  );
}

export default StripeSuccess;
