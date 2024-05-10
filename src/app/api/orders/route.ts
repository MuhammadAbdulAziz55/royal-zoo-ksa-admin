// import dbConnect from "@/lib/db";
// import { Order } from "@/models/Orders";
// import { NextRequest, NextResponse } from "next/server";

// import { PipelineStage } from "mongoose";

// export async function GET(request: NextRequest) {
//   let response = {};
//   try {
//     await dbConnect();

//     let orders = [];

//     // filter start
//     const url = new URL(request.url);
//     const searchParams = new URLSearchParams(url.searchParams);
//     const order_status = searchParams.get("order_status");
//     const sortBy = searchParams.get("sort");
//     const startDate = searchParams.get("date[from]");
//     const endDate = searchParams.get("date[to]");
//     const search = searchParams.get("query");
//     const page = parseInt(searchParams.get("page") || "1"); // Get the page number, default to 1 if not provided

//     // search order
//     if (search !== " ") {
//       const allOrders = await Order.find();
//       // search
//       const searchOrders = allOrders.filter((order) => {
//         return (
//           order.customer_firstName

//             .toLowerCase()
//             .includes(search?.toLowerCase()) ||
//           order.customer_phone.toLowerCase().includes(search?.toLowerCase())
//         );
//       });

//       orders = searchOrders;
//     }

//     console.log("server order", orders);

//     // pagination
//     // Calculate skip value for pagination
//     const limit = 5; // Number of documents per page
//     const skip = (page - 1) * limit;

//     const pipeline: PipelineStage[] = []; // Define pipeline as an array of PipelineStage objects

//     if (order_status !== "all") {
//       pipeline.push({
//         $match: { order_status: order_status },
//       });
//     } else {
//       // If no specific order_status is provided, match all documents
//       pipeline.push({
//         $match: {},
//       });
//     }

//     // short by date,price,customer_name
//     if (sortBy) {
//       switch (sortBy) {
//         case "name asc":
//           pipeline.push({
//             $sort: { customer_firstName: 1 },
//           });
//           break;
//         case "name desc":
//           pipeline.push({
//             $sort: { customer_firstName: -1 },
//           });
//           break;
//         case "price asc":
//           pipeline.push({
//             $sort: { total_price: 1 },
//           });
//           break;
//         case "price desc":
//           pipeline.push({
//             $sort: { total_price: -1 },
//           });
//           break;
//         case "date asc":
//           pipeline.push({
//             $sort: { createdAt: 1 },
//           });
//           break;
//         case "date desc":
//           pipeline.push({
//             $sort: { createdAt: -1 },
//           });
//           break;
//       }
//     }

//     // sort by create date
//     if (startDate && endDate) {
//       pipeline.push({
//         $match: {
//           createdAt: {
//             $gte: new Date(startDate),
//             $lte: new Date(endDate),
//           },
//         },
//       });
//     }

//     // Add pagination stages

//     pipeline.push({ $skip: skip }, { $limit: limit });

//     orders = await Order.aggregate(pipeline);

//     // if (search === " ") {

//     // }
//     const orderCount = await Order.countDocuments();

//     response = {
//       status: "success",
//       orders: orders,
//       orderCount: orderCount,
//       // allOrders: allOrders,
//     };
//   } catch (error) {
//     console.log(error);
//     response = {
//       status: "failed",
//     };
//   }
//   return NextResponse.json(response);
// }

// way two

// import dbConnect from "@/lib/db";
// import { Order } from "@/models/Orders";
// import { NextRequest, NextResponse } from "next/server";

// import { PipelineStage } from "mongoose";

// export async function GET(request: NextRequest) {
//   let response = {};
//   try {
//     await dbConnect();

//     const url = new URL(request.url);
//     const searchParams = new URLSearchParams(url.searchParams);
//     const order_status = searchParams.get("order_status");
//     const sortBy = searchParams.get("sort");
//     const startDate = searchParams.get("date[from]");
//     const endDate = searchParams.get("date[to]");
//     const search = searchParams.get("query");
//     const page = parseInt(searchParams.get("page") || "1");

//     let orders = [];
//     let orderCount = 0;

//     // Define pagination variables
//     const limit = 5;
//     let skip = 0;

//     // Search orders
//     if (search && search.trim() !== "") {
//       // Search query is present
//       orders = await Order.find({
//         $or: [
//           { customer_firstName: { $regex: new RegExp(search, "i") } },
//           { customer_phone: { $regex: new RegExp(search, "i") } },
//         ],
//       });

//       orderCount = orders.length;

//       // Apply pagination manually to search results
//       skip = (page - 1) * limit;
//       orders = orders.slice(skip, skip + limit);
//     } else {
//       const pipeline: PipelineStage[] = [];

//       // Filter by order status
//       if (order_status && order_status !== "all") {
//         pipeline.push({
//           $match: { order_status: order_status },
//         });
//       }

//       // Sort orders
//       if (sortBy) {
//         switch (sortBy) {
//           case "name asc":
//             pipeline.push({
//               $sort: { customer_firstName: 1 },
//             });
//             break;
//           case "name desc":
//             pipeline.push({
//               $sort: { customer_firstName: -1 },
//             });
//             break;
//           case "price asc":
//             pipeline.push({
//               $sort: { total_price: 1 },
//             });
//             break;
//           case "price desc":
//             pipeline.push({
//               $sort: { total_price: -1 },
//             });
//             break;
//           case "date asc":
//             pipeline.push({
//               $sort: { createdAt: 1 },
//             });
//             break;
//           case "date desc":
//             pipeline.push({
//               $sort: { createdAt: -1 },
//             });
//             break;
//         }
//       }

//       // Filter by date range
//       if (startDate && endDate) {
//         pipeline.push({
//           $match: {
//             createdAt: {
//               $gte: new Date(startDate),
//               $lte: new Date(endDate),
//             },
//           },
//         });
//       }

//       // Count total documents
//       orderCount = await Order.countDocuments(
//         order_status && order_status !== "all"
//           ? { order_status: order_status }
//           : {}
//       );

//       // Calculate pagination skip value
//       skip = (page - 1) * limit;
//       pipeline.push({ $skip: skip }, { $limit: limit });

//       orders = await Order.aggregate(pipeline);
//     }

//     response = {
//       status: "success",
//       orders: orders,
//       orderCount: orderCount,
//     };
//   } catch (error) {
//     console.log(error);
//     response = {
//       status: "failed",
//     };
//   }
//   return NextResponse.json(response);
// }

// 3rd way _________________________________________
import dbConnect from "@/lib/db";
import { Order } from "@/models/Orders";
import { NextRequest, NextResponse } from "next/server";

import { PipelineStage } from "mongoose";

export async function GET(request: NextRequest) {
  let response = {};
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const searchParamsObject = Object.fromEntries(searchParams.entries());

    const {
      order_status,
      sort: sortBy,
      date: serializedDate,
      page,
      query: search,
    } = searchParamsObject;

    // Deserialize the date object
    const date = JSON.parse(serializedDate);
    const startDate = date.from;
    const endDate = date.to;

    let pipeline: PipelineStage[] = [];

    // Match stage for order status
    if (order_status && order_status !== "all") {
      pipeline.push({
        $match: { order_status: order_status },
      });
    }

    // Search query match stage
    if (search && search.trim() !== "") {
      pipeline.push({
        $match: {
          $or: [
            { customer_firstName: { $regex: new RegExp(search, "i") } },
            { customer_phone: { $regex: new RegExp(search, "i") } },
          ],
        },
      });
    }

    // Sort stage
    if (sortBy) {
      switch (sortBy) {
        case "name asc":
          pipeline.push({
            $sort: { customer_firstName: 1 },
          });
          break;
        case "name desc":
          pipeline.push({
            $sort: { customer_firstName: -1 },
          });
          break;
        case "price asc":
          pipeline.push({
            $sort: { total_price: 1 },
          });
          break;
        case "price desc":
          pipeline.push({
            $sort: { total_price: -1 },
          });
          break;
        case "date asc":
          pipeline.push({
            $sort: { createdAt: 1 },
          });
          break;
        case "date desc":
          pipeline.push({
            $sort: { createdAt: -1 },
          });
          break;
      }
    }

    // Date range match stage
    if (startDate && endDate) {
      pipeline.push({
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      });
    }

    // Execute aggregation pipeline to count total documents
    const totalOrders = await Order.aggregate([
      ...pipeline,
      { $count: "count" },
    ]);

    const orderCount = totalOrders.length > 0 ? totalOrders[0].count : 0;

    // Pagination
    const limit = 5;
    const totalPages = Math.ceil(orderCount / limit);

    const currentPage = Number(page) || 1;

    const skip = (currentPage - 1) * limit;

    pipeline.push({ $skip: skip }, { $limit: limit });

    // Execute aggregation pipeline to fetch orders
    let orders = await Order.aggregate(pipeline);

    response = {
      status: "success",
      orders: orders,
      orderCount: orderCount, // this orderCount parameter pass optional now
      totalPages: totalPages,
    };
  } catch (error) {
    console.log(error);
    response = {
      status: "failed",
    };
  }
  return NextResponse.json(response);
}

// _________________________________;

// import dbConnect from "@/lib/db";
// import { Order } from "@/models/Orders";
// import { NextRequest, NextResponse } from "next/server";

// import { PipelineStage } from "mongoose";

// export async function GET(request: NextRequest) {
//   let response = {};
//   try {
//     await dbConnect();

//     const searchParams = request.nextUrl.searchParams;
//     const searchParamsObject = Object.fromEntries(searchParams.entries());

//     const {
//       order_status,
//       sort: sortBy,
//       date: serializedDate,
//       page,
//       query: search,
//     } = searchParamsObject;

//     // Deserialize the date object
//     const date = JSON.parse(serializedDate);
//     const startDate = date.from;
//     const endDate = date.to;

//     // const url = new URL(request.url);
//     // const searchParams = new URLSearchParams(url.searchParams);
//     // const order_status = searchParams.get("order_status");
//     // const sortBy = searchParams.get("sort");
//     // const startDate = searchParams.get("date[from]");
//     // const endDate = searchParams.get("date[to]");
//     // const search = searchParams.get("query");
//     // const page = parseInt(searchParams.get("page") || "1");

//     let pipeline: PipelineStage[] = [];

//     // Match stage for order status
//     if (order_status && order_status !== "all") {
//       pipeline.push({
//         $match: { order_status: order_status },
//       });
//     }

//     // Search query match stage
//     if (search && search.trim() !== "") {
//       pipeline.push({
//         $match: {
//           $or: [
//             { customer_firstName: { $regex: new RegExp(search, "i") } },
//             { customer_phone: { $regex: new RegExp(search, "i") } },
//           ],
//         },
//       });
//     }

//     // Sort stage
//     // if (sortBy) {
//     //   switch (sortBy) {
//     //     case "name asc":
//     //       pipeline.push({
//     //         $sort: { customer_firstName: 1 },
//     //       });
//     //       break;
//     //     case "name desc":
//     //       pipeline.push({
//     //         $sort: { customer_firstName: -1 },
//     //       });
//     //       break;
//     //     case "price asc":
//     //       pipeline.push({
//     //         $sort: { total_price: 1 },
//     //       });
//     //       break;
//     //     case "price desc":
//     //       pipeline.push({
//     //         $sort: { total_price: -1 },
//     //       });
//     //       break;
//     //     case "date asc":
//     //       pipeline.push({
//     //         $sort: { createdAt: 1 },
//     //       });
//     //       break;
//     //     case "date desc":
//     //       pipeline.push({
//     //         $sort: { createdAt: -1 },
//     //       });
//     //       break;
//     //   }
//     // }

//     // Date range match stage
//     if (startDate && endDate) {
//       pipeline.push({
//         $match: {
//           createdAt: {
//             $gte: new Date(startDate),
//             $lte: new Date(endDate),
//           },
//         },
//       });
//     }

//     // Execute aggregation pipeline to count total documents
//     const totalOrders = await Order.aggregate([
//       ...pipeline,
//       { $count: "count" },
//     ]);

//     const orderCount = totalOrders.length > 0 ? totalOrders[0].count : 0;

//     // Pagination
//     const limit = 5;
//     const totalPages = Math.ceil(orderCount / limit);
//     const currentPage = Math.min(Math.max(parseInt(page), 1), totalPages);

//     const skip = (currentPage - 1) * limit;
//     pipeline.push({ $skip: skip }, { $limit: limit });

//     // Execute aggregation pipeline to fetch orders
//     let query = Order.aggregate(pipeline);
//     if (sortBy) {
//       switch (sortBy) {
//         case "name asc":
//           query = query.sort({ customer_firstName: 1 });
//           break;
//         case "name desc":
//           query = query.sort({ customer_firstName: -1 });
//           break;
//         case "price asc":
//           query = query.sort({ total_price: 1 });
//           break;
//         case "price desc":
//           query = query.sort({ total_price: -1 });
//           break;
//         case "date asc":
//           query = query.sort({ createdAt: 1 });
//           break;
//         case "date desc":
//           query = query.sort({ createdAt: -1 });
//           break;
//       }

//       const orders = await query.exec();

//       response = {
//         status: "success",
//         orders: orders,
//         orderCount: orderCount,
//         totalPages: totalPages,
//         currentPage: currentPage,
//       };
//     }

//     const orders = await query.exec();

//     response = {
//       status: "success",
//       orders: orders,
//       orderCount: orderCount,
//       totalPages: totalPages,
//       currentPage: currentPage,
//     };
//   } catch (error) {
//     console.log(error);
//     response = {
//       status: "failed",
//     };
//   }
//   return NextResponse.json(response);
// }
