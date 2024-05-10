import dbConnect from "@/lib/db";
import { Order } from "@/models/Orders";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let response = {};
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { serializedZoneDate } = searchParamsObject;

    const date = JSON.parse(serializedZoneDate);
    const startDate = date.from;
    const endDate = date.to;

    // console.log("startDate", startDate);
    // console.log("endDate", endDate);

    const totalOrderByZone = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: "$customer_area",
          total_orders: { $sum: 1 }, // Count the occurrences of each order status
        },
      },
      {
        $project: {
          _id: 0, // Exclude the MongoDB generated _id
          zone: "$_id",
          total_orders: 1,
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    response = {
      status: "success",
      totalOrderByZone: totalOrderByZone,
    };
  } catch (error) {
    console.log("error", error);
    response = {
      status: "failed",
      message: "area zone data find error",
    };
  }
  return NextResponse.json(response);
}
