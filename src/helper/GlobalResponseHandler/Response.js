export const SuccessLog = (
  res,
  status = 200,
  message = "Success",
  data = null,
) => {
  return res.status(status).json({
    success: true,
    message,
    ...(data !== null && { data }),
  });
};

export const ErrorLog = (res, error, message = "Internal Server Error") => {
  console.error("Error Log =>", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? message
          : error?.message || message,
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? message
          : error?.message || message,
      key : error?.keyValue || error?.errorResponse?.keyValue || ""
    });
  }

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? message
        : error?.message || message,
  });
};
