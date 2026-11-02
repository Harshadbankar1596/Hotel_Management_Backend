import cloudinary from "../config/cloudinary/cloudinary.js";
import { Readable } from "stream";

export const uploadToCloudinary = (file, folder = "hotel-management") => {
  return new Promise((resolve, reject) => {
    if (!file?.buffer) {
      return reject(new Error("File is required"));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        });
      },
    );

    Readable.from(file.buffer).pipe(stream);
  });
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
