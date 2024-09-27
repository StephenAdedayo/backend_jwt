const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendMail = require("../utils/email");

const registerUser = async (req, res) => {
  try {

    
    const { fullName, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "user exists" });
    }

    const user = await User.create({ fullName, email, phone, password });

    if (user) {
      const token = generateToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: "user successfully register",
        user,
        token,
      });
    }
  } catch (error) {
    res.status(400).json({ message: "invalid user data" });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "user exists" });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      isAdmin: true,
    });

    if (user) {
      const token = generateToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: "user successfully register",
        user,
        token,
      });
    }
  } catch (error) {
    res.status(400).json({ message: "invalid user data" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(400).json({ message: "user does not exist" });
    }

    const isPasswordMatch = await userExists.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(userExists._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(201)
      .json({ message: "user logged in successfully", userExists, token });
  } catch (error) {
    return res.status(400).json({ message: "invalid password or email" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email, isAdmin : true });

    if (!userExists) {
      res.status(400).json({ message: "user does not exist" });
    }

    // if (!userExists.isAdmin) {
    //   return res.status(403).json({ message: "Access denied. Not an admin." });
    // }

    const isPasswordMatch = await userExists.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // if (userExists && (await userExists.matchPassword(password))) {
      const token = generateToken(userExists._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res
        .status(201)
        .json({ message: "user logged in successfully", userExists, token });
    // }
  } catch (error) {
    res.status(400).json({ message: "invalid password or email" });
  }
};

const logOut = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: new Date(0),
    });

    res.status(200).json({ message: "user logged out successfully" });
  } catch (error) {
    res.status(400).json({ message: "logout failed" });
  }
};

const forgotPasswordUser = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ message: "user not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = Date.now() + 10 * 160 * 1000;

  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/reset-password/${resetToken}`;

  const message = `You are receiving this email because you or someone else have requested the reset of a password. Please click the following link to reset your password: \n\n ${resetUrl}`;

  await sendMail({
    email: user.email,
    subject: "RESET PASSWORD URL",
    message,
  });

  res
    .status(200)
    .json({ success: true, data: "reset password link sent successfully" });
};



const forgotPasswordAdmin = async (req, res) => {
  const { email } = req.body; 

  const admin = await User.findOne({ email, isAdmin : true });

  if (!admin) {
    res.status(400).json({ message: "user not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  admin.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  admin.resetPasswordExpires = Date.now() + 10 * 160 * 1000;

  await admin.save();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/reset-password/${resetToken}`;

  const message = `You are receiving this email because you or someone else have requested the reset of a password. Please click the following link to reset your password: \n\n ${resetUrl}`;

  await sendMail({
    email: admin.email,
    subject: "RESET PASSWORD URL",
    message,
  });

  res
    .status(200)
    .json({ success: true, data: "reset password link sent successfully" });
};









const resetPasswordUser = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({ message: "invalid token" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ success: true, data: "password reset successfully" });
};



const resetPasswordAdmin = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const admin = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
    isAdmin : true
  });

  if (!admin) {
    res.status(400).json({ message: "invalid token" });
  }

  admin.password = req.body.password;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpires = undefined;

  await admin.save();

  res.status(200).json({ success: true, data: "password reset successfully" });
};


const getAllUsers = async (req, res) => {
    
  try {
    const users = await User.find({})

    if(!users){
      res.status(400).json({message : 'no users found'})
    }

    res.status(200).json({success: true , data : users})
  } catch (error) {
    res.status(500).json({message: 'server error', error: error.message})
  }
      

}

// using email
const getUserByEmail = async (req, res) => {
  try {
    // const { email } = req.query; // Use query params to pass email
    const user = await User.findOne(req.params.email); // Fetch user by email
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ success: true, data : user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// using id
const getSingleUser = async (req, res) => {
  
  
  try {
    const user = await User.findById(req.params.id)

    if(!user){
      res.status(400).json({message: 'user not found'})
    }

   res.status(200).json({success : true, data : user})

  } catch (error) {
     res.status(500).json({message: 'error occured', error : error.message})
  }


}


const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Assume user ID comes from the token
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields that are provided
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // If a password is provided, hash and update it
    if (req.body.password) {
      user.password = req.body.password;
    }

     await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const updateAdminProfile = async (req, res) => {
  try {
    // Find the user by ID
    const admin = await User.findById(req.params.id);
    
    // Check if the user exists and is an admin
    if (!admin || !admin.isAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update only the fields that are provided in the request body
    admin.fullName = req.body.fullName || admin.fullName;
    admin.email = req.body.email || admin.email;
    admin.phone = req.body.phone || admin.phone;

    // If a password is provided, update it
    if (req.body.password) {
      admin.password = req.body.password; // Assuming you're hashing the password in the User model before saving
    }

    // Save the updated admin information
    await admin.save();

    // Respond with the updated admin info
    res.status(200).json({
      message: "Admin updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  registerAdmin,
  loginUser,
  loginAdmin,
  logOut,
  forgotPasswordUser,
  resetPasswordUser,
  resetPasswordAdmin,
  forgotPasswordAdmin,
  getAllUsers,
  getSingleUser,
  getUserByEmail,
  updateUserProfile,
  updateAdminProfile
};
