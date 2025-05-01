const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  sendOtp,
  verifyOtp,
}= require("../../controllers/auth/auth-controller");

const router = express.Router();


router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);




router.get("/checkauth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

module.exports = router;
