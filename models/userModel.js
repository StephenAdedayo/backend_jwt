const mongoose = require("mongoose");
// const connectDB = require('../db/db')
const bcrypt = require("bcrypt");

//  connectDB()

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// const users = async () => {
  // const userDB = await connectDB()
  const users = mongoose.model("User", userSchema);
// }

module.exports = users
