import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const CryptPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const ComparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
