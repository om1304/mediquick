const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const JWT_SECRET = process.env.JWT_SECRET;

//creating a transporter
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "kayley.morissette37@ethereal.email",
    pass: "QeN915NdQFAp5JnHZr",
  },
});

// Controller to create a user
exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const securePass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: securePass,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
      role: req.body.role,
    });

    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ authToken });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Controller to login a user
exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid login credentials." });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ message: "Invalid login credentials." });
    }

    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ authToken });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Controller to get user details
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

//controller for forgot password which sends email via nodemailer
exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Generate token and expiration time
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes
    await user.save();

    // Create reset link (assuming running on localhost)
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Send email
    const mailOptions = {
      from: '"mediQuick" <mediquick@gmail.com>',
      to: user.email,
      subject: "Password Reset Request",
      html: `<b>You requested a password reset. Click here to reset:</b> <a href=${resetLink}>Reset Link</a>`,
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({ message: `Password reset email sent to ${email}`,
    messageId: info.messageId,
    token: resetToken
    });
  } catch (error) {
    console.log("Error in sending email", error.message)
  }
}

//controller for reser password which allows the user to reset password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token hasn’t expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password and update it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

//controller to update user profile 
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have the user ID in req.user from your middleware
    const { name, email, address, contactNumber } = req.body;

    // Validate incoming data (you can add more validation as needed)

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        address,
        contactNumber,
      },
      { new: true, runValidators: true } // Options to return the updated document and validate
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
