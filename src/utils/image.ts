import sharp from "sharp";

import { existsSync, mkdirSync } from "fs";

function convertToValidFilename(productName: string) {
  return productName.replace(/[\/|\\:*?"<>]/g, "").replaceAll(" ", "_");
}

export const getImageMaxDimension = async ({ buffer }: { buffer: Buffer }) => {
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

    // if (imageFileInfo.width > imageFileInfo.height) {
    //   if (imageFileInfo.width > 1920) {
    //     imageFileMaxWidth = 1920;
    //   } else {
    //     imageFileMaxWidth = imageFileInfo.width;
    //   }
    // } else {
    //   if (imageFileInfo.height > 1080) {
    //     imageFileMaxHeight = 1080;
    //   } else {
    //     imageFileMaxHeight = imageFileInfo.height;
    //   }
    // }
  }

  return {
    imageFileMaxWidth,
    imageFileMaxHeight,
  };
};

export const resizeAndSaveImage = async (
  {
    buffer,
    productPrimaryCategory,
  }: {
    buffer: Buffer;
    productPrimaryCategory: string;
  },
  dimensions: any,
) => {
  // productPrimaryCategory = convertToValidFilename(productPrimaryCategory);
  let imageCount = 0;
  let timeNow: number | undefined;
  const getTimeNow = () => {
    if (timeNow === undefined) {
      timeNow = Date.now();
    }
    return timeNow;
  };
  const savedImagePaths: string[] = [];
  const imageFileExtension = ".webp";

  const imageUploadDir =
    process.cwd() +
    "/public/uploads/product_image/" +
    getTimeNow() +
    "_" +
    productPrimaryCategory;

  if (!existsSync(imageUploadDir)) {
    mkdirSync(imageUploadDir, { recursive: true });
  }

  for (const dimension of dimensions) {
    imageCount++;
    await sharp(buffer)
      .resize({
        ...dimension,
        fit: "outside",
      })
      .webp({ quality: 80 })
      .toFile(
        imageUploadDir +
          "/" +
          "image" +
          "_" +
          imageCount +
          "_" +
          (dimension.width ? dimension.width : "") +
          (dimension.height
            ? (dimension.width ? "x" : "") + dimension.height
            : "") +
          imageFileExtension,
      );

    savedImagePaths.push(
      "/uploads/product_image/" +
        getTimeNow() +
        "_" +
        productPrimaryCategory +
        "/" +
        "image" +
        "_" +
        imageCount +
        "_" +
        (dimension.width ? dimension.width : "") +
        (dimension.height
          ? (dimension.width ? "x" : "") + dimension.height
          : "") +
        imageFileExtension,
    );
  }

  return savedImagePaths;
};
