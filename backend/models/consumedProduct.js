import mongoose from "mongoose";

const { Schema } = mongoose;

const ConsumedProductSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const ConsumedProduct =
  mongoose.models.ConsumedProduct ||
  mongoose.model("ConsumedProduct", ConsumedProductSchema);

export default ConsumedProduct;
