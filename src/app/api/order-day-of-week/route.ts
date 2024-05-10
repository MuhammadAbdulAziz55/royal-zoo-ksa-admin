import dbConnect from "@/lib/db";
import { Order } from "@/models/Orders";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let response = {};
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const searchParamsObject = Object.fromEntries(searchParams.entries());

    // const { startDate } = searchParamsObject;

    const currentDate = new Date();

    const lastWeekStartDate = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    ); // Start date of the last week
    const lastWeekEndDate = currentDate; // End date is today

    const OrderByDayOfWeek = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastWeekStartDate,
            $lte: lastWeekEndDate,
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" }, // Group by day of the week
          totalOrders: { $sum: 1 },
          total_price: { $sum: "$total_price" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the MongoDB generated _id
          day: "$_id",
          totalOrders: 1,
          total_price: 1,
        },
      },
      {
        $sort: { _id: 1 }, // Sort by day of the week (Sunday to Saturday)
      },
    ]);

    console.log("OrderByDayOfWeek", OrderByDayOfWeek);

    // Create an array to hold the response
    const dayOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const orderData = OrderByDayOfWeek.find((item) => item.day === i);
      const totalOrders = orderData ? orderData.totalOrders : 0;
      const total_price = orderData ? orderData.total_price : 0;
      dayOfWeek.push({ totalOrders, day: i, total_price });
    }

    response = {
      status: "success",
      OrderByDayOfWeek: OrderByDayOfWeek,
    };
  } catch (error) {
    console.log("error", error);
    response = {
      status: "failed",
      message: "day of week failed",
    };
  }
  return NextResponse.json(response);
}
