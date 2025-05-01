import { useToast } from "@/components/ui/use-toast";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 

const AuthLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const result = await dispatch(loginUser(formData));
    if (result?.payload?.success) {
      navigate("/auth/otp-verification", { state: { email: formData.email } });

      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "OTP sent to your email." });
      } else {
        toast({ title: data.message || "Failed to send OTP.", variant: "destructive" });
      }
    } else {
      toast({ title: result?.payload?.message, variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?{" "}
          <Link className="font-medium ml-2 text-primary hover:underline" to="/auth/register">
            Register
          </Link>
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white text-black border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white text-black border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded"
            >
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthLogin;
