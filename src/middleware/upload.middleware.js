import multer from "multer";

const storage = multer.memoryStorage();

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".jfif",
  ".png",
  ".webp",
  ".gif",
  ".avif",
];

const fileFilter = (req, file, cb) => {
  const extension = file.originalname
    .toLowerCase()
    .slice(file.originalname.lastIndexOf("."));

  if (
    allowedTypes.includes(file.mimetype) &&
    allowedExtensions.includes(extension)
  ) {
    return cb(null, true);
  }

  return cb(new Error("Unsupported image format"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
