const mongoose = require("mongoose");

const shoeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 character long"],
      maxlength: [15, "Name cannot be more than 15 characters long"],
    },
    brand: {
      type: String,
      enum: ["Rolex", "Richard Mille", "Jacob&Co"],
      required: [true, "Brand is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
      max: [10000, "Price cannot exceed 10,000"],
      validate: {
        validator: Number.isInteger,
        message: "Price must be an integer",
      },
    },
    imageUrl: {
      type: String,
      required: [true, "img URL is required"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    // collection:"shoesname any    collection ka name mongo me"
  }
);

const Shoe = mongoose.model("Shoe", shoeSchema);

module.exports = Shoe;

