import mongoose from "mongoose";
const { Schema } = mongoose;

const dailyLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dailyIntake: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  desiredWeight: {
    type: Number,
    required: true,
  },
  currentWeight: {
    type: Number,
    required: true,
  },
  nonRecommendedProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const DailyLog = mongoose.model("DailyLog", dailyLogSchema);
export default DailyLog;
