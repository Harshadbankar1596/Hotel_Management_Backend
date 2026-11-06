import cloudinary from "../config/cloudinary/cloudinary.js";
import { Readable } from "stream";

export const uploadToCloudinary = async (file, folder = "menu-items") => {
  try {
    if (!file?.buffer) {
      throw new Error("Image file is required");
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            {
              width: 300,
              height: 300,
              crop: "limit",
              quality: "auto:low",
              fetch_format: "webp",
              flags: "strip_profile",
            },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      Readable.from(file.buffer).pipe(stream);
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};


export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    throw new Error("Cloudinary public ID is required");
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });

  return result;
};

export const uploadMultipleToCloudinary = async (
  files,
  folder = "hotel-management",
) => {
  return Promise.all(files.map((file) => uploadToCloudinary(file, folder)));
};
