import express from "express";
import { authenticateToken } from "../middleware/productMiddleware.js";

import {
  addConsumedProducts,
  deleteConsumedProduct,
  getConsumedProductsByDate,
  searchProducts,
} from "../controllers/product.js";
  
const router = express.Router();

/**
 * @swagger
 * /api/foods/search:
 *   get:
 *     summary: Search products based on a query string
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         description: Query string to search products
 *         required: true
 *         schema:
 *           type: string
 *           example: apple
 *     responses:
 *       200:
 *         description: Successfully retrieved matching products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 5d51694802b2373622ff5555
 *                       title:
 *                         type: string
 *                         example: Apple
 *       400:
 *         description: Bad request due to missing or invalid query parameter
 *       500:
 *         description: Server error
 */
router.get("/search", authenticateToken, searchProducts);
/**
 * @swagger
 * /api/foods/add:
 *   post:
 *     summary: Add a consumed product
 *     tags: [Consumed Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product consumed
 *                 example: Green buckwheat for sprouting
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product consumed
 *                 example: 150
 *             required:
 *               - name
 *               - quantity
 *     responses:
 *       201:
 *         description: Consumed product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Consumed product added successfully
 *                 consumedProduct:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 5f8d0c5b7e9a6d00123e8b27
 *                     product:
 *                       type: string
 *                       example: 5d51694802b2373622ff5555
 *                     user:
 *                       type: string
 *                       example: 5f8d0c5b7e9a6d00123e8b28
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-08-04T00:00:00.000Z
 *                     quantity:
 *                       type: integer
 *                       example: 150
 *       400:
 *         description: Bad request due to missing or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product name and quantity are required
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */
router.post("/add", authenticateToken, addConsumedProducts);

/**
 * @swagger
 * /api/foods/delete:
 *   delete:
 *     summary: Delete a consumed product
 *     tags: [Consumed Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the consumed product to delete
 *                 example: 5d51694802b2373622ff5555
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Consumed product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Consumed product deleted successfully
 *                 removedProduct:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 5d51694802b2373622ff5555
 *                     product:
 *                       type: string
 *                       example: 5d51694802b2373622ff5555
 *                     user:
 *                       type: string
 *                       example: 66b0940210d82fcffca9aa17
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: 2024-08-04T00:00:00.000Z
 *                     quantity:
 *                       type: integer
 *                       example: 150
 *       400:
 *         description: Bad request due to missing or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product ID is required
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */
router.delete("/delete", authenticateToken, deleteConsumedProduct);

/**
 * @swagger
 * /api/foods/consumed-products:
 *   get:
 *     summary: Retrieve all consumed products for a specific day
 *     tags: [Consumed Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: '2024-08-04'
 *         description: The date to retrieve consumed products for
 *     responses:
 *       200:
 *         description: Successfully retrieved consumed products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 consumedProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 5f8d0c5b7e9a6d00123e8b27
 *                       product:
 *                         type: string
 *                         example: 5d51694802b2373622ff5555
 *                       user:
 *                         type: string
 *                         example: 66b0940210d82fcffca9aa17
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: '2024-08-04'
 *                       quantity:
 *                         type: integer
 *                         example: 150
 *       400:
 *         description: Bad request due to missing or invalid date query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Date query parameter is required
 *       404:
 *         description: No consumed products found for the specified date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No products found for the specified date
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */
router.get("/consumed-products", authenticateToken, getConsumedProductsByDate);

export default router;
