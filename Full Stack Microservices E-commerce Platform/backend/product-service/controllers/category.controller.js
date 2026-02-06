import { Category } from '../models/category.model.js';

// ADD A CATEGORY ENDPOINT
export const addCategory = async (req, res) => {
  const {name, description} = req.body;
  try {
    const category = new Category({
      name:name,
      description: description
    });
    console.log(category)
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({
        success:false,
        message: error.message
    });
  }
};

// GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
  }
};

// DELETE ENDPOINT
export const deleteCategory = async (req, res) => {
  try {
    const {categoryId} = req.query;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category id is required"
      });
    }

    const category = await Category.findOneAndDelete({ categoryId: categoryId });
    
    if(!category){
      res.status(404).json({
        success:false,
        message: 'Category not found!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted',
      deletedCategory: category
    });

  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({
      success:false,
      message: error.message
    });
  }
};

// UPDATE ENDPOINT
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const { name, description } = req.body; // fields to update

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category id is required"
      });
    }

    // Update category
    const category = await Category.findOneAndUpdate(
      { categoryId },            // filter
      { name, description },     // fields to update
      { new: true }              // return updated document
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      updatedCategory: category
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
