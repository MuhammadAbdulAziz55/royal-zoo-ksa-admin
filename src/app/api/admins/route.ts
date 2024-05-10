import dbConnect from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: any) {
  try {
    await dbConnect();
    const { username, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const existingUser = await AdminUser.findOne({ username: username });
    if (existingUser) {
      // If the user exists, return an error response
      return NextResponse.json({
        status: "error",
        message: "Username already exists",
      });
    }

    const newUser = {
      username,
      password: hashedPassword,
      is_SupperAdmin: false,
    };
    await AdminUser.create(newUser);
    // Return a success response
    return NextResponse.json({
      status: "success",
      message: "Successfully created admin user",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return NextResponse.json({
      status: "error",
      message: "something wrong",
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const allAdmins = await AdminUser.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      status: "success",
      admins: allAdmins,
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "something wrong get users",
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { _id, ...updateAdmin } = data;

    await dbConnect();
    const filter = { _id: data?._id };

    const result = await AdminUser.updateOne(filter, { $set: updateAdmin });
    return NextResponse.json({
      status: "success",
      message: "successfully edit admins",
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "something wrong for admins edit",
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const query = Object.fromEntries(request.nextUrl.searchParams);
    console.log("id", query);

    await dbConnect();
    // Remove the item from the database
    await AdminUser.findOneAndDelete(query);

    return NextResponse.json({
      status: "success",
      message: "successfully admin  deleted",
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({
      status: "error",
      message: error.message,
    });
  }
}
