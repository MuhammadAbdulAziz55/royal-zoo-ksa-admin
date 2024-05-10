import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer_firstName: {
      type: String,
      required: true,
    },
    customer_lastName: {
      type: String,
      required: false,
    },
    customer_email: {
      type: String,
      required: true,
    },
    customer_phone: {
      type: String,
      required: false,
    },
    customer_shipping_address: {
      type: String,
      required: false,
    },
    customer_area: {
      type: String,
      required: false,
    },
    customer_area_type: {
      type: String,
      required: false,
    },

    delivery_charge: {
      type: String,
      required: false,
    },

    total_price: {
      type: Number,
      required: false,
    },
    user_id: {
      type: String,
      required: false,
    },
    ordered_products: [
      {
        product_id: {
          type: String,
          required: true,
        },
        product_price: {
          type: Number,
          required: true,
        },
        product_quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    payment_status: {
      type: String,
      required: false,
    },
    payment_method: {
      type: String,
      required: false,
    },
    card_type: {
      type: String,
      required: false,
    },
    order_status: {
      type: String,
      required: false,
    },
    TranId: String,
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
