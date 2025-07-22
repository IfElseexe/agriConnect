import { productOptions } from '../config/productOptions.js';

export const getProductOptions = (req, res) => {
  res.status(200).json(productOptions);
};
