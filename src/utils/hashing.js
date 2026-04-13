import bcrypt from "bcrypt";
import e from "express";

export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function passwordLengthCheck(password) {
  return password.length >= 8;
}
