import Product from '../models/Products.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Farmer)
export const createProduct = asyncHandler(async (req, res) => {
  console.log('REQ BODY:', req.body);
  console.log('REQ FILE:', req.file);

  const {
    name,
    category,
    variety,
    harvestStart,
    harvestEnd,
    quantity,
    unit,
    storage,
    certifications,
    description,
    price,
    location
  } = req.body;

  // Handle certifications if it's sent as a JSON string
  let parsedCertifications = [];
  try {
    parsedCertifications = certifications
      ? JSON.parse(certifications)
      : [];
  } catch (err) {
    console.warn('Could not parse certifications:', err.message);
  }

  const images = req.file ? [req.file.filename] : [];

  const newProduct = new Product({
    farmerId: req.user._id,
    name,
    category,
    variety,
    harvestStart,
    harvestEnd,
    quantity,
    unit,
    storage,
    description,
    price,
    location,
    certifications: parsedCertifications,
    images,
    status: 'pending'
  });

  const created = await newProduct.save();
  res.status(201).json(created);
});

// @desc    Get all products (Admin or Public)
// @route   GET /api/products
// @access  Private (Admin or Public as needed)
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate('farmerId', 'name email');
  res.json(products);
});


// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Farmer)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.farmerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this product');
  }

  const {
    name,
    category,
    variety,
    harvestStart,
    harvestEnd,
    quantity,
    unit,
    storage,
    certifications,
    description,
    price,
    location,
    images
  } = req.body;

  product.name = name || product.name;
  product.category = category || product.category;
  product.variety = variety || product.variety;
  product.harvestStart = harvestStart || product.harvestStart;
  product.harvestEnd = harvestEnd || product.harvestEnd;
  product.quantity = quantity || product.quantity;
  product.unit = unit || product.unit;
  product.storage = storage || product.storage;
  product.certifications = certifications || product.certifications;
  product.description = description || product.description;
  product.price = price || product.price;
  product.location = location || product.location;
  product.images = images || product.images;

  const updated = await product.save();
  res.json(updated);
});


// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Farmer)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.farmerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this product');
  }

  await Product.findByIdAndDelete(req.params.id); // ✅ FIXED

  res.json({ message: 'Product removed successfully' });
});



// @desc    Approve product
// @route   PATCH /api/products/:id/approve
// @access  Private/Admin
export const approveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.status = 'approved';
  await product.save();

  res.json({ message: 'Product approved' });
});


// @desc    Reject product
// @route   PATCH /api/products/:id/reject
// @access  Private/Admin
export const rejectProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.status = 'rejected';
  await product.save();

  res.json({ message: 'Product rejected' });
});
// @desc    Get all approved products (for buyers)
// @route   GET /api/products/approved
// @access  Public
export const getApprovedProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ status: 'approved' }).populate('farmerId', 'name email');

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

