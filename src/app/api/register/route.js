import { NextResponse } from "next/server";
import Connection from "../../dbconfig/dbconfig";
import User from "../../../../model/UserModel";
import crypto from "crypto";
import transporter from "../../../app/utils/mailer";

export async function POST(req) {
  try {
    await Connection();
    const { email } = await req.json();

    let user = await User.findOne({ email });
    const token = crypto.randomBytes(32).toString("hex");

    if (!user) {
      // If user does not exist, create new one
      user = await User.create({
        name: "Sufyan",
        email,
        token,
      });
    } else {
      // If user exists, update token
      user.token = token;
      await user.save();
    }

    // Send email with login link
    const loginLink = `http://localhost:3000/api/login_email?token=${token}`;

    await transporter.sendMail({
      from: "usmanidrees100@gmail.com",
      to: email,
      subject: "Login to Your Account",
      html: `<p>Click the link below to log in:</p>
             <a href="${loginLink}">Login</a>`,
    });

    return NextResponse.json({ message: "Check your email for login link" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
