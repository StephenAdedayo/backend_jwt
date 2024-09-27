const express = require("express");

const {
  registerUser,
  registerAdmin,
  loginUser,
  logOut,
  loginAdmin,
  forgotPasswordUser,
  resetPasswordUser,
  forgotPasswordAdmin,
  resetPasswordAdmin,
  getAllUsers,
  getSingleUser,
  getUserByEmail,
  updateUserProfile,
  updateAdminProfile

} = require("../controllers/userControllers");

const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();  

router.post("/register", registerUser);
router.post("/register/admin", registerAdmin);
router.post("/loginUser", loginUser);
router.post("/loginAdmin", loginAdmin);
router.post("/logOut", logOut);
router.post("/forgot-password", forgotPasswordUser);
router.post('/forgot-password-admin', forgotPasswordAdmin)
router.put("/reset-password/:resetToken", resetPasswordUser);
router.put('/reset-password/:resetToken', resetPasswordAdmin )
router.get('/getAllUsers', protect, admin, getAllUsers)
router.get('/singleUser/:id', protect, getSingleUser)
router.get('/singleEmail', getUserByEmail)
router.put('/profile/:id', updateUserProfile);
router.put('/profile-admin/:id', protect, admin, updateAdminProfile)


module.exports = router;
