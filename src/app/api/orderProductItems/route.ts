import dbConnect from "@/lib/db";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const orderedItems = await request.json();
  // order data form order table
  const orders = orderedItems.ordered_products;
  // user product id form orderTable
  const orderProductId = orders.map((item: any) => item.product_id);
  let response = {};
  try {
    await dbConnect();
    const OrderProducts = await Product.find({
      _id: { $in: orderProductId },
    });

    // orderProduct add quantity form  order table
    const orderedProductData = OrderProducts.map((product) => ({
      _id: product._id,
      name: product.name,
      images: product.images,
      company_name: product.company_name,
      type: product.type,
      discount_percentage: product.discount_percentage,
      price: orders.find(
        (p: any) => p.product_id.toString() === product._id.toString()
      ).product_price,
      product_quantity: orders.find(
        (p: any) => p.product_id.toString() === product._id.toString()
      ).product_quantity,
    }));

    // console.log("final product ", orderedProductData);

    response = {
      status: "success",
      orders: orderedProductData,
    };
  } catch (error) {
    console.log(error);
    response = {
      status: "failed",
    };
  }

  return NextResponse.json(response);
}
