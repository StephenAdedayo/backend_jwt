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

    const userExists = await User.findOne({ email });

    if (!userExists) {
      res.status(400).json({ message: "user does not exist" });
    }

    if (!userExists.isAdmin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    if (userExists && (await userExists.matchPassword(password))) {
      const token = generateToken(userExists._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res
        .status(201)
        .json({ message: "user logged in successfully", userExists, token });
    }
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

const forgotPassword = async (req, res) => {
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

const resetPassword = async (req, res) => {
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

module.exports = {
  registerUser,
  registerAdmin,
  loginUser,
  loginAdmin,
  logOut,
  forgotPassword,
  resetPassword,
};
