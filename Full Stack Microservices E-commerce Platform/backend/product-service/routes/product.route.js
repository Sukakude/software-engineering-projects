import express from 'express';
import { getProducts, getProductById, addProduct, removeProduct, updateProduct } from '../controllers/product.controller.js';
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";

// DECLARE A ROUTER OBJECT
const router = express.Router();

// ADD PRODUCT
router.post('/add', verifyToken, requireAdmin, addProduct);

// UPDATE PRODUCT
router.put('/edit', verifyToken, requireAdmin, updateProduct);

// DELETE PRODUCT
router.delete('/delete', verifyToken, requireAdmin, removeProduct);

// GET ALL PRODUCTS
router.get('/', getProducts);

// GET PRODUCT BY ID
router.get('/:id', getProductById);

export default router;
