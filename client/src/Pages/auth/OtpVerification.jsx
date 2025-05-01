import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function OtpVerification() {
    const [otp, setOtp] = useState("");
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    
    const userEmail = location.state?.email || "default@example.com";

    const handleOtpSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, otp }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast({ title: "OTP verified successfully!" });
                navigate("/shop/home"); 
            } else {
                toast({ title: data.message || "OTP verification failed.", variant: "destructive" });
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast({ title: "An unexpected error occurred. Please try again.", variant: "destructive" });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 shadow-md rounded">
                <h1 className="text-2xl font-bold mb-4 text-center">OTP Verification</h1>
                <form onSubmit={handleOtpSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter the OTP sent to your email:
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            className="w-full bg-white text-black border border-gray-300 p-2 rounded focus:ring-white focus:border-blue "
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-white text-black border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
}

export default OtpVerification;
