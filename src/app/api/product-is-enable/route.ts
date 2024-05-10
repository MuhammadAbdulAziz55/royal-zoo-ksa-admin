import dbConnect from "@/lib/db";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const is_enabled = await request.json();

  // console.log("isEnable", is_enabled);

  let response = {};
  try {
    await dbConnect();

    const productUpdate = await Product.updateOne(
      { _id: is_enabled._id },
      { $set: is_enabled }
    );

    // console.log("update ", order);

    response = {
      status: "success",
      products: productUpdate,
    };
  } catch (error) {
    console.log(error);
    response = {
      status: "failed",
    };
  }

  return NextResponse.json(response);
}
