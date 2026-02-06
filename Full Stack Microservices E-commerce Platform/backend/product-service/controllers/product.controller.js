import {Product} from '../models/product.model.js';
import {Category} from '../models/category.model.js';
import {sendProductEvent} from '../kafkaProducer.js'

// GET PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, tags, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).populate('category');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ADD PRODUCT
export const addProduct = async (req, res) => {
  const { name, author, description, price, inventory_count, coverImage, categoryName, isbn } = req.body;
  try {
    if (!name || !author || !description || !price || !inventory_count || !coverImage || !categoryName || !isbn) {
      return res.status(400).json({ success: false, message: 'All fields are required!' });
    }

    const productExists = await Product.findOne({name: name});
    if (productExists) {
      return res.status(400).json({ success: false, message: 'Product already exists' });
    }

    const category = await Category.findOne({name: categoryName});
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category does not exist' });
    }

    const product = new Product({
      name: name,
      author: author,
      description: description,
      coverImage: coverImage,
      newPrice: price,
      inventory_count: inventory_count,
      isbn: isbn,
      category: category._id,
      createdBy: req.userId
    });

    sendProductEvent(product);

    await product.save();
    res.status(201).json({ success: true, message: 'Product created!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const {id} = req.query;
    const {name, description, author, categoryId, price, isbn, inventory_count, coverImage} = req.body;

    if(!id){
      return res.status(400).json({
        success:false,
        message: 'Product Id is required'
      });
    }

    const product = await Product.findOneAndUpdate(
      {_id: id,},
      { name: name, description: description, price: price,
        inventory_count: inventory_count, isbn: isbn, author: author,
        category: categoryId, coverImage: coverImage
      },
      {new: true}
    );

    if(!product){
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    sendProductEvent(product);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct: product
    });

  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({
      success:false,
      message: error.message
    });
  }
};

// REMOVE PRODUCT
export const removeProduct = async (req, res) => {
  try {
    const {id} = req.query;
    if(!id){
      return res.status(400).json({
        success: false,
        message: 'Product id is required'
      });
    }

    const product = await Product.findOneAndDelete({_id: id});

    if(!product){
      res.status(404).json({
        success:false,
        message: 'Product does not exists'
      });
    }

    res.status(200).json({
      success:false,
      message: 'Product successfully deleted',
      deletedProduct: product
    });
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({
      success:false,
      message: error.message
    });
  }
};


// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product by MongoDB _id
    const product = await Product.findById(id).populate("category"); // populate category if needed

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ 
      success: true,
      data: product 
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};