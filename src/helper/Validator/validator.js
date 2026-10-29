
export const ValidateBody = (keys = [], body = {}) => {
  const missingKeys = keys.filter((key) => {
    return (
      !Object.prototype.hasOwnProperty.call(body, key) ||
      body[key] === undefined ||
      body[key] === null ||
      (typeof body[key] === "string" && !body[key].trim())
    );
  });

  if (missingKeys.length) {
    return {
      isValid: false,
      message: `Required fields missing: ${missingKeys.join(", ")}`,
      missingKeys,
    };
  }

  return {
    isValid: true,
    message: "Validation successful",
    missingKeys: [],
  };
};

export const ValidateEmail = (email) => {
  if (typeof email !== "string" || !email.trim()) {
    return {
      isValid: false,
      message: "Email is required",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      message: "Please enter a valid email address",
    };
  }

  return {
    isValid: true,
    message: "Valid email address",
  };
};



export const ValidatePhone = (phone) => {
  if (typeof phone !== "string" || !phone.trim()) {
    return {
      isValid: false,
      message: "Phone number is required",
    };
  }

  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(phone.trim())) {
    return {
      isValid: false,
      message: "Please enter a valid 10-digit Indian mobile number",
    };
  }

  return {
    isValid: true,
    message: "Valid phone number",
  };
};
