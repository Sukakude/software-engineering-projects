import { getCategories, addCategory, deleteCategory, updateCategory } from '../controllers/category.controller.js';
import express from 'express';
import {verifyToken, requireAdmin} from '../middleware/authMiddleware.js' 

const router = express.Router();

// ADD ROUTE
router.post('/add', verifyToken, requireAdmin, addCategory);

// DELETE ROUTE
router.delete('/delete', verifyToken, requireAdmin, deleteCategory);

// UPDATE ROUTE
router.put('/edit', verifyToken, requireAdmin, updateCategory);

// GET ALL CATEGORIES
router.get('/', getCategories);

export default router;

