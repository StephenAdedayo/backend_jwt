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
router.get('/getAllUsers', getAllUsers)
router.get('/singleUser/:id', getSingleUser)
router.get('/singleEmail', getUserByEmail)
router.put('/profile/:id', updateUserProfile);
router.put('/profile-admin/:id', updateAdminProfile)

module.exports = router;
