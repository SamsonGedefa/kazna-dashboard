import { connectToDatabase } from "../middleware/database";
import normalizeEmail from "validator/lib/normalizeEmail";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export async function findUserByEmailandPassword(email, password) {
  const { db } = await connectToDatabase();

  email = normalizeEmail(email);
  const user = await db.collection("users").findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return { ...user, password: undefined };
  }

  return null;
}

export async function findUserByEmail(email) {
  const { db } = await connectToDatabase();
  return db.collection("users").findOne({ email });
}

export async function findUserByUsername(username) {
  const { db } = await connectToDatabase();
  return db.collection("users").findOne({ username });
}

export async function findUserById(id) {
  const { db } = await connectToDatabase();
  return db.collection("users").findOne({ _id: new ObjectId(id) });
}

export async function updateEmailVerification(id) {
  const { db } = await connectToDatabase();
  return db
    .collection("users")
    .findOne({ _id: new ObjectId(id) }, { $push: { verified: true } });
}

export async function insertUser({
  fullName,
  email,
  orginalPassword,
  username,
  bio,
  profilePicture,
}) {
  const { db } = await connectToDatabase();

  const user = {
    fullName,
    email,
    username,
    bio,
    profilePicture,
    verified: false,
  };

  const hashedPassword = await bcrypt.hash(orginalPassword, 10);

  const { insertID } = db
    .collection("users")
    .insertOne({ ...user, hashedPassword });

  user._id = insertID;

  return user;
}

export function dbProjectionUsers(prefix = "") {
  return {
    [`${prefix}hashedPassword`]: 0,
    [`${prefix}email`]: 0,
    [`${prefix}verified`]: 0,
  };
}
