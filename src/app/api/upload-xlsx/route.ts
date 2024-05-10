const excel = require("exceljs");

import sharp from "sharp";

import { Product } from "@/models/Product";

import { ProductSchema, ProductsSchema } from "@/types";
import { NextResponse } from "next/server";

import { getImageMaxDimension, resizeAndSaveImage } from "@/utils/image";

import { z } from "zod";
import dbConnect from "@/lib/db";
import { Promise } from "mongoose";

const TrimmedProductSchema = ProductSchema.omit({
  _id: true,
  __v: true,
  images: true,
  createdAt: true,
  updatedAt: true,
});

const TrimmedProductsSchema = z.array(TrimmedProductSchema);
// TODO: Need proper error handling

export async function POST(request: Request) {
  try {
    let products: any = [];
    let errors: any = [];
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileExtension = file.name
      .split(".")
      .filter(Boolean)
      .slice(1)
      .join(".");
    const workbook = new excel.Workbook();
    const data = await workbook.xlsx.load(file.arrayBuffer());

    const worksheet = workbook.worksheets[0];

    const actualRowCount = worksheet.actualRowCount - 1;

    let response = {};

    for (let row of worksheet.getRows(2, actualRowCount)) {
      let product: any = {};
      let images: any = [];
      row.eachCell({ includeEmpty: true }, (cell: any, cellNumber: number) => {
        if (cellNumber > 1) {
          const cellKey = worksheet.getCell(cell.address.slice(0, 1) + 1).value;
          const cellVal = cell.value;
          if (cellKey && cellVal) {
            const trimmedCellKey = cellKey.trim();
            let trimmedCellValue = cellVal;
            if (typeof cellVal === "string") {
              trimmedCellValue = cellVal.trim().toLowerCase();
            }

            if (trimmedCellKey.toLowerCase() === "sub_category") {
              trimmedCellValue = trimmedCellValue
                .split(",")
                .map((name: string) => name.trim());
            }

            product[trimmedCellKey.toLowerCase()] = trimmedCellValue;
          }
        }
      });
      try {
        product = TrimmedProductSchema.parse(product);
      } catch (error) {
        errors = [
          ...errors,
          {
            row: row.number,
            error: error,
          },
        ];
      }
      products.push(product);
      const rowImages = worksheet.getImages().filter((image: any) => {
        if (image.range.tl.nativeRow + 1 === row.number) {
          return true;
        }
      });
      if (rowImages.length > 0) {
        const rowImageIds = rowImages.map((image: any) => image.imageId);
        images = rowImageIds.map((imageId: any) => {
          const img = workbook.model.media.find(
            (m: any) => m.index === imageId,
          );
          return img;
        });
        product.images = images;
      }
    }

    if (errors.length > 0) {
      console.log(errors);
      throw new Error("Invalid data");
    }

    for (let product of products) {
      if (!product.images) {
        product.images = [
          [
            "/uploads/images/placeholder-non-medicine/non-medicine-20.jpg",
            "/uploads/images/placeholder-non-medicine/non-medicine-500.jpg",
          ],
        ];
      } else {
        const tempImages = [];
        for (let image of product.images) {
          const { imageFileMaxWidth, imageFileMaxHeight } =
            await getImageMaxDimension({
              buffer: image.buffer,
            });

          const imageFileInfo = await sharp(image.buffer).metadata();

          const imageDimensions = [
            { width: 20 },
            imageFileInfo.width &&
              imageFileInfo.width - 50 > 150 && {
                width: 150,
              },
            imageFileInfo.width &&
              imageFileInfo.width - 100 > 300 && {
                width: 300,
              },
            imageFileInfo.width &&
              imageFileInfo.width - 150 > 500 && {
                width: 500,
              },
            JSON.parse(
              JSON.stringify({
                width: imageFileMaxWidth,
                height: imageFileMaxHeight,
              }),
            ),
          ].filter(Boolean);

          const savedImagePaths = await resizeAndSaveImage(
            {
              buffer: image.buffer,
              productPrimaryCategory: product.primary_category,
            },
            imageDimensions,
          );
          tempImages.push(savedImagePaths);
        }
        product.images = tempImages;
      }
    }
    await dbConnect();
    const dbRes = await Product.insertMany(products);
    console.log(dbRes);
    response = {
      status: "success",
      products: dbRes,
    };
    return NextResponse.json({
      products,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({});
  }

  // for (let row of worksheet.getRows(2, worksheet.actualRowCount - 1)) {
  //   let product: any = {};
  //   row.eachCell({ includeEmpty: true }, (cell: any, cellNumber: number) => {
  //     if (cellNumber > 1) {
  //       const cellKey = worksheet.getCell(cell.address.slice(0, 1) + 1).value;
  //       const cellVal = cell.value;
  //       if (cellKey && cellVal) {
  //         const trimmedCellKey = cellKey.trim();
  //         let trimmedCellValue = cellVal;
  //         if (typeof cellVal === "string") {
  //           trimmedCellValue = cellVal.trim().toLowerCase();
  //         }
  //
  //         if (trimmedCellKey.toLowerCase() === "generic_names") {
  //           trimmedCellValue = trimmedCellValue
  //             .split(",")
  //             .map((name: string) => name.trim());
  //         }
  //
  //         product[trimmedCellKey.toLowerCase()] = trimmedCellValue;
  //       }
  //     }
  //   });
  //   product = TrimmedProductSchema.parse(product);
  //   const rowImages = worksheet.getImages().filter((image: any) => {
  //     if (image.range.tl.nativeRow + 1 === row.number) {
  //       return true;
  //     }
  //   });
  //   const allSavedImagePaths: any = [];
  //   if (rowImages.length >= 1) {
  //     const rowImageIds = rowImages.map((image: any) => image.imageId);
  //     const images = rowImageIds.map((imageId: any) => {
  //       const img = workbook.model.media.find(
  //         (m: any) => m.index === imageId,
  //       );
  //       return img;
  //     });
  //     for (const image of images) {
  //       const { imageFileMaxWidth, imageFileMaxHeight } =
  //         await getImageMaxDimension({
  //           buffer: image.buffer,
  //         });
  //
  //       const savedImagePaths = await resizeAndSaveImage(
  //         {
  //           buffer: image.buffer,
  //           productName: product.name,
  //         },
  //         [
  //           { width: 20 },
  //           { width: 500 },
  //           {
  //             width: imageFileMaxWidth,
  //             height: imageFileMaxHeight,
  //           },
  //         ],
  //       );
  //       allSavedImagePaths.push(savedImagePaths);
  //     }
  //   } else {
  //     throw new Error("No images found in row " + row.number);
  //   }
  //   product.images = allSavedImagePaths;
  //   const TrimmedProductSchemaWithImages = TrimmedProductSchema.extend({
  //     images: ProductSchema.shape.images,
  //   });
  //   product = TrimmedProductSchemaWithImages.parse(product);
  //   products.push(product);
  // }
  // console.log(error);
  // if (error instanceof z.ZodError) {
  //   console.log({
  //     row: row.number,
  //     fields: error.issues[0].path.map((field: any) => field),
  //     issues: error.issues,
  //   });
  //   response = {
  //     status: "failed",
  //     row: row.number,
  //     issues: error.issues,
  //   };
  // } else {
  //   console.log(error);
  //   response = {
  //     status: "failed",
  //     error: error,
  //   };
  // }
  // break;

  // console.log(worksheet.getRow(2).values);

  // for (const image of worksheet.getImages()) {
  //   console.log(
  //     "processing image row",
  //     image.range.tl.nativeRow,
  //     "col",
  //     image.range.tl.nativeCol,
  //     "imageId",
  //     image.imageId,
  //   );
  // fetch the media item with the data (it seems the imageId matches up with m.index?)
  // const img = workbook.model.media.find(
  //   (m: any) => m.index === image.imageId,
  // );
  // fs.writeFileSync(
  //   process.cwd() +
  //     "/test/images/" +
  //     `${image.range.tl.nativeRow}.${image.range.tl.nativeCol}.${img.name}.${img.extension}`,
  //   img.buffer,
  // );
  // }
}
