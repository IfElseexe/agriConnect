import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: { type: String, required: true },
    category: { type: String },
    description: { type: String },
    quantity: { type: Number },
    unit: { type: String },
    price: { type: Number },
    location: { type: String },
    images: {
      type: [String],
      default: [] // ensures the field is always an array even if empty
    },
    tags: [String],
    variety: { type: String },
    harvestStart: { type: Date },
    harvestEnd: { type: Date },
    yield: { type: Number },
    storage: { type: String },
    certifications: [String],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    visibility: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
