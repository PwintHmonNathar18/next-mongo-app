import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String, required: true },
  stock: { type: Number, default: 0 },
  // Add other fields as needed
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;

// Grid column definitions
export const productColumns = [
  { field: 'code', headerName: 'Code', width: 130 },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'price', headerName: 'Price', width: 90 },
  { field: 'category', headerName: 'Category', width: 150, valueGetter: (params) => params.row.category?.name || '' },
  { field: 'description', headerName: 'Description', width: 180 },
  { field: 'stock', headerName: 'Stock', width: 100 },
];
