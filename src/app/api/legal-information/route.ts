import dbConnect from "@/lib/db";
import { LegalInformation } from "@/models/legal-information";

import { NextResponse } from "next/server";

export async function POST(request: any) {
  const body = await request.json();

  let response = {};
  try {
    await dbConnect();

    const legalInformation = await LegalInformation.create(body);

    response = {
      status: "success",
      products: legalInformation,
    };
  } catch (error) {
    console.log(error);
    response = {
      status: "failed",
    };
  }
  return NextResponse.json(response);
}
