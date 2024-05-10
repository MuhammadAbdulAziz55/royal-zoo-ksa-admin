import dbConnect from "@/lib/db";
import { Product } from "@/models/Product";
import { PipelineStage } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let response = {};
  try {
    await dbConnect();
    // params start
    const searchParams = request.nextUrl.searchParams;
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    let {
      page,
      search,
      primaryCategory,
      subCategory,
      sortBy,
      isEnableDisable,
    } = searchParamsObject;
    // params end

    let pipeline: PipelineStage[] = [];

    // Search query match stage
    if (search && search.trim() !== "") {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: new RegExp(search, "i") } },
            { company_name: { $regex: new RegExp(search, "i") } },
          ],
        },
      });
    }

    // filter primary category
    if (primaryCategory && primaryCategory.trim() !== "") {
      page = "1";
      pipeline.push({
        $match: { primary_category: primaryCategory },
      });
    }

    // filter sub category
    if (subCategory && subCategory.trim() !== "") {
      pipeline.push({
        $match: { sub_category: subCategory },
      });
    }

    // sortBy name ,price,date
    if (sortBy) {
      switch (sortBy) {
        case "name asc":
          pipeline.push({
            $sort: { name: 1 },
          });
          break;
        case "name desc":
          pipeline.push({
            $sort: { name: -1 },
          });
          break;
        case "price asc":
          pipeline.push({
            $sort: { price: 1 },
          });
          break;
        case "price desc":
          pipeline.push({
            $sort: { price: -1 },
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

    // isEnable or IsDisable
    if (isEnableDisable && isEnableDisable.trim() !== "") {
      let active = true;
      switch (isEnableDisable) {
        case "enable":
          active = true;
          break;
        case "disable":
          active = false;
          break;
      }

      pipeline.push({
        $match: { is_enabled: active },
      });
    }

    const totalProduct = await Product.aggregate([
      ...pipeline,
      { $count: "count" },
    ]);

    const productCount = totalProduct.length > 0 ? totalProduct[0].count : 0;

    // Pagination
    const limit = 5;
    const totalPages = Math.ceil(productCount / limit);

    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * limit;

    pipeline.push({ $skip: skip }, { $limit: limit });

    // Execute aggregation pipeline to fetch orders
    let products = await Product.aggregate(pipeline);

    response = {
      status: "success",
      products: products,
      totalPages: totalPages,
      productCount: productCount,
    };
  } catch (error) {
    console.log(error);
    response = {
      status: "failed",
    };
  }
  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  let response = {};
  const sharp = require("sharp");
  try {
    await dbConnect();
    const formData = Array.from(await request.formData());

    const images = formData.filter((data) => !data[0].startsWith("otherData"));

    const otherFields = Object.fromEntries(
      formData.filter((data: any) => data[0].startsWith("otherData"))
    );

    // console.log("images", images);
    // console.log("otherFields", otherFields);

    // const productWithoutImages = await Product.create({
    //   ...otherFields,
    // });

    const getImageMaxDimension = async ({ buffer }: { buffer: Buffer }) => {
      let imageFileMaxHeight: number | undefined;
      let imageFileMaxWidth: number | undefined;

      const imageFileInfo = await sharp(buffer).metadata();

      if (imageFileInfo.width && imageFileInfo.height) {
        if (imageFileInfo.width > 1920 || imageFileInfo.height > 1080) {
          if (imageFileInfo.width > 1920) {
            imageFileMaxWidth = 1920;
          } else {
            imageFileMaxHeight = 1080;
          }
        } else {
          imageFileMaxWidth = imageFileInfo.width;
          imageFileMaxHeight = imageFileInfo.height;
        }
      }

      return {
        imageFileMaxWidth,
        imageFileMaxHeight,
      };
    };
    // image convert binary
    images?.forEach(async (image: any, index: number) => {
      const buffer = Buffer.from(await image[1].arrayBuffer()); // image[1] menes file access
      // const imageFileName = "image_" + (index + 1);
      const imageFileName = "image_" + (index + 1);

      //  image size convert
      const { imageFileMaxWidth, imageFileMaxHeight } =
        await getImageMaxDimension({
          buffer,
        });

      console.log("forEac himageFileMaxWidth ", imageFileMaxWidth);
    });

    const imagePaths = [];

    // console.log("otherFields with out image", otherFields);
    // console.log("otherFields with out image", images);
  } catch (error) {
    console.log("app product error", error);
    response = {
      status: "error",
      message: "something wrong add product",
    };
  }

  return NextResponse.json(response);
}
