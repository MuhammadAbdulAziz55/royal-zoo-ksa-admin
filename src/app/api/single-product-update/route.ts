import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { Product } from "@/models/Product";

export async function POST(request: any) {
  // Parse the request body as JSON
  const updateProductData = await request.json();

  // Remove the images field from the updateProductData object
  const { images, ...dataToUpdate } = updateProductData;

  let response = {};
  try {
    await dbConnect();

    const products = await Product.updateOne(
      { _id: updateProductData._id },
      { $set: dataToUpdate }
    );

    // console.log("update ", products);

    response = {
      status: "success",
      products: products,
    };
  } catch (error) {
    console.log(error);
    response = {
      status: "failed",
    };
  }
  return NextResponse.json(response);
}
