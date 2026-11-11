// export const SuccessLog = (
//   res,
//   status = 200,
//   message = "Success",
//   data = null,
// ) => {
//   return res.status(status).json({
//     success: true,
//     message,
//     ...(data !== null && { data }),
//   });
// };

// export const ErrorLog = (res, error, message = "Internal Server Error") => {
//   console.error("Error Log =>", error);

//   if (error.name === "ValidationError") {
//     return res.status(400).json({
//       success: false,
//       message:
//         process.env.NODE_ENV === "production"
//           ? message
//           : error?.message || message,
//     });
//   }

//   if (error.code === 11000) {
//     return res.status(409).json({
//       success: false,
//       message:
//         process.env.NODE_ENV === "production"
//           ? message
//           : error?.message || message,
//       key : error?.keyValue || error?.errorResponse?.keyValue || ""
//     });
//   }

//   return res.status(500).json({
//     success: false,
//     message:
//       process.env.NODE_ENV === "production"
//         ? message
//         : error?.message || message,
//   });
// };

// export const InvalidResponse = (res , status , message , success=false) => {
//   return res.status(status).json({
//     message,
//     success
//   })
// }



export const SuccessLog = (
  res,
  status = 200,
  message = "Success",
  data = null
) => {
  return res.status(status).json({
    success: true,
    message,
    ...(data !== null && { data }),
  });
};

export const ErrorLog = (
  res,
  error,
  message = "Internal Server Error"
) => {
  console.error("Error Log =>", error);

  const isProduction = process.env.NODE_ENV === "production";

  if (error?.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: isProduction ? message : error.message,
    });
  }

  if (error?.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: isProduction ? "Invalid ID" : error.message,
    });
  }

  if (error?.code === 11000) {
    const keyValue =
      error?.keyValue || error?.errorResponse?.keyValue || {};

    return res.status(409).json({
      success: false,
      message: isProduction ? message : "Duplicate value already exists",
      ...(!isProduction && { key: keyValue }),
    });
  }

  return res.status(500).json({
    success: false,
    message: isProduction ? message : error?.message || message,
  });
};

export const ResponseLog = (
  res,
  status = 400,
  message = "Invalid Request"
) => {
  return res.status(status).json({
    success: false,
    message,
  });
};
