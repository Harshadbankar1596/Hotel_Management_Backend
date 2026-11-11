
const isProduction = process.env.NODE_ENV === "production";

const defaultCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

export const SetCookie = (
  res,
  tokenName,
  token,
  maxAge = 7 * 24 * 60 * 60 * 1000
) => {
  return res.cookie(tokenName, token, {
    ...defaultCookieOptions,
    maxAge,
  });
};

export const ClearCookie = (res, tokenName) => {
  return res.clearCookie(tokenName, defaultCookieOptions);
};
