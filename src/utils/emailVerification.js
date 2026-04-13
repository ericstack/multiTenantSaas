import { User } from "../models/index.js";

export function emailVerification(email) {
  // Regular expression for validating an Email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email);
}

export async function checkEmailDuplicate(email) {
  // Check if the email already exists in the database
  const existingUser = await User.findOne({ where: { email } });
  return existingUser !== null;
}
