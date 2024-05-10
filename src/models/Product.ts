import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    is_enabled: { type: Boolean, default: true },
    images: { type: [[String]], require: true },
    name: { type: String, require: true },
    generic_name: { type: String },
    strength: { type: String },
    quantity: { type: Number },
    quantity_unit: { type: String },
    type: { type: String },
    company_name: { type: String },
    model: { type: String },
    size: { type: String },
    discount_amount: { type: Number, default: 0 },
    discount_percentage: { type: Number, default: 0 },
    stock: { type: Number, default: 1 },
    price: { type: Number, require: true },
    primary_category: { type: String, require: true },
    sub_category: { type: [String], require: true },
    is_hot_deal: { type: Boolean, default: false },
    is_featured: { type: Boolean, default: false },
    is_daily_deal: { type: Boolean, default: false },
    code: { type: Number },
    batch_id: { type: Number },
    manufacture_date: { type: Date },
    expiration_date: { type: Date },
    description: { type: String },
  },
  { timestamps: true },
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
