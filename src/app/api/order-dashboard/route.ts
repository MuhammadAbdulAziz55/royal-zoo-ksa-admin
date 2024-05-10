import dbConnect from "@/lib/db";
import { Order } from "@/models/Orders";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let response = {};

  try {
    dbConnect();
    //  / Fetch last 10 recent orders
    const resentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);

    // Fetch total order count
    const totalOrderCount = await Order.countDocuments();
    const totalUser = await User.countDocuments();

    const totalOrderByOrderStatus = await Order.aggregate([
      {
        $group: {
          _id: "$order_status",
          total: { $sum: 1 }, // Count the occurrences of each order status
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    response = {
      status: "success",
      totalUser: totalUser,
      resentOrders: resentOrders,
      totalOrderCount: totalOrderCount,
      totalOrderByStatus: totalOrderByOrderStatus,
    };
  } catch (error) {
    console.log("Failed get orders dashboard");
    response = {
      status: "failed",
    };
  }

  return NextResponse.json(response);
}
