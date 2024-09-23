const express = require("express");

const {
  registerUser,
  registerAdmin,
  loginUser,
  logOut,
  loginAdmin,
  forgotPassword,
  resetPassword,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", registerUser);
router.post("/register/admin", registerAdmin);
router.post("/loginUser", loginUser);
router.post("/loginAdmin", loginAdmin);
router.post("/logOut", logOut);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

module.exports = router;
