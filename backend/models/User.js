const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  contactNumber: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  cart: {
    items: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        prescriptionRequired: { type: Boolean, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: { type: Number, default: 0 },
  },
  resetPasswordToken: { type: String }, // New field for reset token
  resetPasswordExpires: { type: Date }, // New field for token expiration
  date: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
