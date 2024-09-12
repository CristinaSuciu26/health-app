import { getProducts } from "../controllers/product.js";
import express from "express";

import {
  authenticateToken,
  validateDailyIntakeBody,
  validateProductQuery,
  verifyUser,
} from "../middleware/productMiddleware.js";
import { getDailyIntake } from "../controllers/dailyIntake.js";

const router = express.Router();
/**
 * @swagger
 * /api/foods/daily-intake:
 *   post:
 *     summary: Save daily calorie intake details for the authenticated user
 *     tags: [Daily Intake]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dailyIntake:
 *                 type: number
 *                 example: 2000
 *               nonRecommendedProducts:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "productId1"
 *             required:
 *               - dailyIntake
 *               - nonRecommendedProducts
 *     responses:
 *       200:
 *         description: Successfully saved daily intake details
 *       400:
 *         description: Bad request due to missing or invalid request body
 *       500:
 *         description: Server Error
 */
router.post(
  "/daily-intake",
  validateDailyIntakeBody,
  authenticateToken,
  verifyUser,
  getDailyIntake
);
/**
 * @swagger
 * /api/foods/intake:
 *   get:
 *     summary: Get calories for products not allowed for a specific blood type
 *     tags: [Nutrition]
 *     parameters:
 *       - in: query
 *         name: bloodType
 *         schema:
 *           type: string
 *         required: true
 *         description: Blood type for which products are not allowed
 *       - in: query
 *         name: age
 *         schema:
 *           type: integer
 *         required: true
 *         description: Age of the user
 *       - in: query
 *         name: height
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: Height of the user in centimeters
 *       - in: query
 *         name: currentWeight
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: Current weight of the user in kilograms
 *       - in: query
 *         name: desiredWeight
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: Desired weight of the user in kilograms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of product titles and their calories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dailyIntake:
 *                   type: number
 *                   example: 2000
 *                 nonRecommendedProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Milk"
 *                       calories:
 *                         type: number
 *                         example: 150
 *       400:
 *         description: Bad request due to missing or invalid query parameters
 *       404:
 *         description: No products found for the given criteria
 *       500:
 *         description: Server Error
 */
router.get("/intake", validateProductQuery, getProducts);

export default router;
