import ProductService from "../services/productService.js";
import ConsumedProduct from "../models/consumedProduct.js";
import DailyLog from "../models/daily.js";

export const getProducts = async (req, res) => {
  try {
    const { bloodType, age, height, currentWeight, desiredWeight } = req.query;

    if (!bloodType || !age || !height || !currentWeight || !desiredWeight) {
      return res.status(400).json({ message: "All parameters are required" });
    }

    const parsedAge = parseInt(age);
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

    res.status(200).json({
      dailyIntake,
      nonRecommendedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getDailyIntake = async (req, res) => {
  try {
    if (!req.user.id) {
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

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query string is required" });
    }
    const products = await ProductService.searchProducts(query);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addConsumedProducts = async (req, res) => {
  try {
    const { productName, quantity } = req.body;

    if (!productName || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const currentDate = new Date();
    const product = await ProductService.findProductByName(productName);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const consumedProduct = new ConsumedProduct({
      product: product._id,
      user: req.user.id,
      date: currentDate,
      quantity,
    });

    const savedProduct = await consumedProduct.save();
    const populatedProduct = await savedProduct.populate("product");

    const totalCalories = (product.calories / 100) * quantity;

    res.status(201).json({
      message: "Consumed product added successfully",
      consumedProduct: {
        ...populatedProduct.toObject(),
        totalCalories,
      },
    });
  } catch (error) {
    console.error("Error adding consumed product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteConsumedProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const removedProduct = await ConsumedProduct.findByIdAndDelete(id);

    if (!removedProduct) {
      return res.status(404).json({ message: "Consumed product not found" });
    }

    res.status(200).json({
      message: "Consumed product deleted successfully",
      removedProduct,
    });
  } catch (error) {
    console.error("Error deleting consumed product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getConsumedProductsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user.id;
    if (!date) {
      return res
        .status(400)
        .json({ message: "Date query parameter is required" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const consumedProducts = await ConsumedProduct.find({
      user: userId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).populate({
      path: "product",
      select: "title calories",
    });

    if (!consumedProducts.length) {
      return res
        .status(200)
        .json({ message: "No products found for the specified date" });
    }

    res.status(200).json({ consumedProducts });
  } catch (error) {
    console.error("Error retrieving consumed products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
