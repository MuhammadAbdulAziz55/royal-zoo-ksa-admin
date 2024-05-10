import dbConnect from "@/lib/db";
import { Order } from "@/models/Orders";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const orderStatus = await request.json();
  let response = {};
  try {
    await dbConnect();

    const order = await Order.updateOne(
      { _id: orderStatus._id },
      { $set: orderStatus }
    );

    // console.log("update ", order);

    response = {
      status: "success",
      products: order,
    };
  } catch (error) {
    console.log(error);
    response = {
      status: "failed",
    };
  }
  return NextResponse.json(response);
}
