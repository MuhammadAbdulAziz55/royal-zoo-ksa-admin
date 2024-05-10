import dbConnect from "@/lib/db";
import { Order } from "@/models/Orders";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let response = {};
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const searchParamsObject = Object.fromEntries(searchParams.entries());

    const { startDate } = searchParamsObject;
    // console.log("startDate", startDate);

    // const date = JSON.parse(serializedZoneDate);
    const startDateToUTC = new Date(startDate);
    const currentYear = startDateToUTC.getFullYear();

    console.log("startDate", currentYear);
    // console.log("endDate", endDate);

    // current year
    // const currentDate = new Date();
    // const currentYear = currentDate.getFullYear();
    // const currentMonth = currentDate.getMonth() + 1;
    // const currentDay = currentDate.getDate();

    const totalOrderValueByMonth = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(`${currentYear}-${12}-${31}`),
          },
        },
      },
      {
        $group: {
          // _id: { $dateToString: { format: "%Y-%m-01", date: "$createdAt" } },
          _id: { $dateToString: { format: "%m", date: "$createdAt" } },
          totalOrders: { $sum: 1 },
          total_price: { $sum: "$total_price" },
        },
      },

      {
        $project: {
          _id: 0, // Exclude the MongoDB generated _id
          month: "$_id",
          totalOrders: 1,
          total_price: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    response = {
      status: "success",
      totalOrderByMonthOfYear: totalOrderValueByMonth,
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
