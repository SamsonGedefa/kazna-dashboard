import type { NextApiRequest, NextApiResponse } from "next";
import isEmail from "validator/lib/isEmail";
import {
  insertUser,
  findUserByEmail,
  findUserByUsername,
} from "../../../lib/db/user";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { sendMail } from "../../../api-lib/mail";

type ResponseData = {
  message: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return;
  }

  let { email, fullName, password, username } = req.body;

  if (!isEmail(email)) {
    res
      .status(400)
      .json({ error: { message: "The email you entered is invalid." } });
    return;
  }

  if (await findUserByEmail(email)) {
    res
      .status(403)
      .json({ error: { message: "The email has already been used." } });
    return;
  }

  if (await findUserByUsername(username)) {
    res
      .status(403)
      .json({ error: { message: "The username has already been taken." } });
    return;
  }

  const user = await insertUser({
    fullName,
    email,
    orginalPassword: password,
    username,
    bio: "",
  });

  if (!user) throw error;

  const newUser = await findUserByEmail(user.email);
  const id = String(newUser._id);

  const token = jwt.sign(
    { id },
    process.env.NEXTAUTH_PROVIDER_EMAIL_VERIFICATION_SECRET,
    {
      expiresIn: "1d",
    }
  );

  await sendMail({
    to: user.email,
    from: "noreply@gmail.com",
    subject: `Verification Email for ${process.env.WEB_URI}`,
    html: `
    <div>
      <p>Hello, ${user.fullName}</p>
      <p>Please follow <a href="${process.env.WEB_URI}/verify-email/${token}">this link</a> to confirm your email.</p>
    </div>
    `,
  });

  res.status(201).json({ message: "Ok" });
}

export default handler;
