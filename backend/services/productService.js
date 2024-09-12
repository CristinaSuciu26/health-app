import Product from "../models/product.js";

const getCalories = async () => {
  try {
    const products = await Product.find();
    return products.map((product) => ({
      title: product.title,
      calories: product.calories,
    }));
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};

const getProductsNotAllowedForBloodType = async (bloodType) => {
  try {
    const query = { [`groupBloodNotAllowed.${bloodType}`]: true };
    return await Product.find(query);
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};

const calculateDailyIntake = (age, height, currentWeight, desiredWeight) => {
  if (
    !age ||
    !height ||
    !currentWeight ||
    !desiredWeight ||
    isNaN(age) ||
    isNaN(height) ||
    isNaN(currentWeight) ||
    isNaN(desiredWeight)
  ) {
    throw new Error(
      "Invalid or incomplete user profile data for calculating daily intake."
    );
  }
  const bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
  const activityLevelMultiplier = 1.55;
  const maintenanceCalories = Math.round(bmr * activityLevelMultiplier);

  const weeklyWeightChange = desiredWeight - currentWeight;
  const dailyCalorieAdjustment = (weeklyWeightChange * 500) / 7;

  return Math.round(maintenanceCalories + dailyCalorieAdjustment);
};
const searchProducts = async (query) => {
  try {
    if (!query) {
      throw new Error("Query is required for searching products");
    }
    return await Product.find({
      title: { $regex: query, $options: "i" },
    });
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};
const findProductByName = async (productName) => {
  try {
    return await Product.findOne({ title: productName });
  } catch (error) {
    throw new Error("Error fetching product: " + error.message);
  }
};

const deleteProduct = async (productId) => {
  try {
    return await Product.findByIdAndDelete(productId);
  } catch (error) {
    console.error("Error deleting product", error);
    throw error;
  }
};
const createProductIfNotExists = async (
  productName,
  calories,
  otherFields = {}
) => {
  try {
    let product = await findProductByName(productName);
    if (!product) {
      product = new Product({
        title: productName,
        calories,
        quantity,
        ...otherFields,
      });
      await product.save();
      console.log(`Product ${productName} created successfully.`);
    } else {
      console.log(`Product ${productName} already exists.`);
    }
    return product;
  } catch (error) {
    throw new Error("Error creating product: " + error.message);
  }
};

const ProductService = {
  getProductsNotAllowedForBloodType,
  getCalories,
  calculateDailyIntake,
  searchProducts,
  findProductByName,
  deleteProduct,
  createProductIfNotExists,
};
export default ProductService;
