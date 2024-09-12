import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema({
  categories: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  groupBloodNotAllowed: {
    type: {
      1: {
        type: Boolean,
        required: true,
      },
      2: {
        type: Boolean,
        required: true,
      },
      3: {
        type: Boolean,
        required: true,
      },
      4: {
        type: Boolean,
        required: true,
      },
    },
    required: true,
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
