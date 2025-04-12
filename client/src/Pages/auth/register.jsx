import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls, otpFormControls } from "@/config";
import { registerUser, verifyOtp } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// Initial states for forms
const initialRegisterState = {
  userName: "",
  email: "",
  password: "",
};

const initialOtpState = {
  email: "",
  otp: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialRegisterState);
  const [otpData, setOtpData] = useState(initialOtpState);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle registration form submission
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    // Validate username
    if (!/^[A-Z][a-zA-Z0-9 ]{7,}$/.test(formData.userName)) {
      toast({
        title:
          "Username must start with a capital letter, be at least 8 characters long, and can include spaces.",
        variant: "destructive",
      });
      return;
    }

    // Validate password
    const passwordValidationPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordValidationPattern.test(formData.password)) {
      toast({
        title:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        variant: "destructive",
      });
      return;
    }

    const result = await dispatch(registerUser(formData));

    if (result?.payload?.success) {
      toast({ title: result.payload.message });
      setIsOtpSent(true);
      setOtpData((prev) => ({ ...prev, email: formData.email }));
    } else {
      toast({
        title: result?.payload?.message || "Registration failed.",
        variant: "destructive",
      });
    }
  };

  // Handle OTP form submission
  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(verifyOtp(otpData));

    if (result?.payload?.success) {
      toast({ title: "Account verified successfully!" });
      navigate("/auth/login");
    } else {
      toast({
        title: result?.payload?.message || "OTP verification failed.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {isOtpSent ? "Verify Your Account" : "Create New Account"}
        </h1>
        {!isOtpSent && (
          <p className="mt-2">
            Already have an account?
            <Link
              className="font-medium ml-2 text-primary hover:underline"
              to="/auth/login"
            >
              Login
            </Link>
          </p>
        )}
      </div>

      {/* Conditionally render the appropriate form */}
      {isOtpSent ? (
        <CommonForm
          formControls={otpFormControls}
          buttonText="Verify OTP"
          formData={otpData}
          setFormData={setOtpData}
          onSubmit={handleOtpSubmit}
        />
      ) : (
        <CommonForm
          formControls={registerFormControls}
          buttonText="Sign Up"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleRegisterSubmit}
        />
      )}
    </div>
  );
}

export default AuthRegister;
