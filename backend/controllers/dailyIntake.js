import ProductService from "../services/productService.js";
import DailyLog from "../models/daily.js";

export const getDailyIntake = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { bloodType, age, height, currentWeight, desiredWeight } = req.body;

    if (
      bloodType === undefined ||
      age === undefined ||
      height === undefined ||
      currentWeight === undefined ||
      desiredWeight === undefined
    ) {
      return res.status(400).json({ message: "Missing user profile data" });
    }

    const parsedAge = parseInt(age, 10);
    const parsedHeight = parseFloat(height);
    const parsedCurrentWeight = parseFloat(currentWeight);
    const parsedDesiredWeight = parseFloat(desiredWeight);

    if (
      isNaN(parsedAge) ||
      isNaN(parsedHeight) ||
      isNaN(parsedCurrentWeight) ||
      isNaN(parsedDesiredWeight)
    ) {
      return res.status(400).json({ message: "Invalid parameter values" });
    }

    const dailyIntake = ProductService.calculateDailyIntake(
      parsedAge,
      parsedHeight,
      parsedCurrentWeight,
      parsedDesiredWeight
    );

    const products = await ProductService.getProductsNotAllowedForBloodType(
      bloodType
    );

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const nonRecommendedProducts = products.map((product) => ({
      _id: product._id,
      title: product.title,
    }));

    const log = new DailyLog({
      user: req.user.id,
      date: new Date(),
      dailyIntake,
      age: parsedAge,
      height: parsedHeight,
      desiredWeight: parsedDesiredWeight,
      currentWeight: parsedCurrentWeight,
      nonRecommendedProducts,
    });

    await log.save();
    console.log("DailyLog instance:", log);

    res.status(200).json({
      message: "Daily intake and non-recommended products saved successfully!",
      dailyIntake,
      nonRecommendedProducts,
    });
  } catch (error) {
    console.error("Error saving daily intake:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
