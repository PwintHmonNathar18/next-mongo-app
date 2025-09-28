import { MoneyOffCsredRounded } from "@mui/icons-material";
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  order: Number
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;