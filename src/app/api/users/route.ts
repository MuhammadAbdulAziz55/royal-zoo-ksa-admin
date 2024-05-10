import dbConnect from "@/lib/db";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let response = {};
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const searchParamsObject = Object.fromEntries(searchParams.entries());

    let users = await User.find();

    response = {
      status: "success",
      users: users,
    };
  } catch (error) {
    console.log(error);
    response = {
      status: "failed",
      message: "failed find user",
    };
  }
  return NextResponse.json(response);
}
