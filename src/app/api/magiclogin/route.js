// // import { NextResponse } from "next/server";
// // import crypto from "crypto";
// // import nodemailer from "nodemailer";
// // import User from "../../../../../model/UserModel";
// // import Connection from "@/app/dbconfig/dbconfig";
// // import { serialize, parse } from "cookie";

// // // 🔹 Email Transporter Configuration
// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.EMAIL_SERVER_USER,
// //     pass: process.env.EMAIL_SERVER_PASSWORD,
// //   },
// // });

// // // 🔹 Send Email Function
// // async function sendVerificationEmail(email, token) {
// //   const mailOptions = {
// //     from: process.env.EMAIL_SERVER_USER,
// //     to: email,
// //     subject: "Email Verification",
// //     text: `Click on this link to verify your email:
// //     http://localhost:3000/api/auth/magiclogin?token=${token}`,
// //   };

// //   return transporter.sendMail(mailOptions);
// // }

// // // 🔹 POST Request - Send Verification Email
// // export async function POST(req) {
// //   try {
// //     const { email } = await req.json();

// //     if (!email) {
// //       return NextResponse.json({ error: "Email is required" }, { status: 400 });
// //     }

// //     // ✅ Database Connection
// //     await Connection();

// //     // ✅ Check if user exists
// //     let user = await User.findOne({ email });

// //     const token = crypto.randomBytes(32).toString("hex");
// //     const tokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

// //     if (user) {
// //       user.token = token;
// //       user.tokenExpiresAt = tokenExpiresAt;
// //       await user.save();
// //     } else {
// //       user = new User({ email, token, tokenExpiresAt });
// //       await user.save();
// //     }

// //     // ✅ Send Verification Email
// //     await sendVerificationEmail(email, token);

// //     return NextResponse.json({
// //       message: "Verification email sent.",
// //     });
// //   } catch (error) {
// //     console.error("Error:", error);
// //     return NextResponse.json(
// //       { error: "Internal server error" },
// //       { status: 500 }
// //     );
// //   }
// // }
// // export async function GET(req) {
// //   try {
// //     const url = new URL(req.url);
// //     const token = url.searchParams.get("token");

// //     if (!token) {
// //       return NextResponse.json({ error: "Token is required" }, { status: 400 });
// //     }

// //     // ✅ Connect to Database
// //     await Connection();

// //     // ✅ Find user by token
// //     const user = await User.findOne({ token });

// //     if (!user) {
// //       return NextResponse.json({ error: "Invalid token" }, { status: 400 });
// //     }

// //     // ✅ Check Token Expiry
// //     if (new Date() > new Date(user.tokenExpiresAt)) {
// //       return NextResponse.json({ error: "Token has expired" }, { status: 400 });
// //     }

// //     // ✅ Generate Session Token
// //     const sessionToken = crypto.randomBytes(32).toString("hex");

// //     // ✅ Store session token in database
// //     user.sessionToken = sessionToken;
// //     user.sessionTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
// //     await user.save();

// //     // ✅ Set Cookie (Securely)
// //     const cookie = serialize("sessionToken", sessionToken, {
// //       httpOnly: true,
// //       path: "/",
// //       maxAge: 60 * 60, // 1 hour
// //       secure: process.env.NODE_ENV === "production",
// //       sameSite: "Lax",
// //     });

// //     // ✅ Send Response with Cookie
// //     return new Response(
// //       JSON.stringify({
// //         message: "Email verified successfully, session created",
// //         sessionToken,
// //       }),
// //       {
// //         status: 200,
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Set-Cookie": cookie,
// //         },
// //       }
// //     );
// //   } catch (error) {
// //     console.error("Error:", error);
// //     return NextResponse.json(
// //       { error: "Internal server error" },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import nodemailer from "nodemailer";
// import User from "../../../../model/UserModel";
// import Connection from "@/app/dbconfig/dbconfig";
// import { serialize } from "cookie";

// // 🔹 Email Transporter Configuration
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_SERVER_USER,
//     pass: process.env.EMAIL_SERVER_PASSWORD,
//   },
// });

// // 🔹 Send Email Function
// async function sendVerificationEmail(email, token) {
//   const mailOptions = {
//     from: process.env.EMAIL_SERVER_USER,
//     to: email,
//     subject: "Email Verification",
//     text: `Click on this link to verify your email:
//     http://localhost:3000/api/auth/magiclogin?token=${token}`,
//   };

//   return transporter.sendMail(mailOptions);
// }

// // 🔹 POST Request - Send Verification Email
// export async function POST(req) {
//   try {
//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     // ✅ Database Connection
//     await Connection();

//     // ✅ Check if user exists
//     let user = await User.findOne({ email });

//     const token = crypto.randomBytes(32).toString("hex");
//     const tokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

//     if (user) {
//       user.token = token;
//       user.tokenExpiresAt = tokenExpiresAt;
//       await user.save();
//     } else {
//       user = new User({ email, token, tokenExpiresAt });
//       await user.save();
//     }

//     // ✅ Send Verification Email
//     await sendVerificationEmail(email, token);

//     return NextResponse.json({
//       message: "Verification email sent.",
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req) {
//   try {
//     const url = new URL(req.url);
//     const token = url.searchParams.get("token");

//     if (!token) {
//       return NextResponse.json({ error: "Token is required" }, { status: 400 });
//     }

//     // ✅ Connect to Database
//     await Connection();

//     // ✅ Find user by token
//     const user = await User.findOne({ token });

//     if (!user) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 400 });
//     }

//     // ✅ Check Token Expiry
//     if (new Date() > new Date(user.tokenExpiresAt)) {
//       return NextResponse.json({ error: "Token has expired" }, { status: 400 });
//     }

//     // ✅ Generate Session Token
//     const sessionToken = crypto.randomBytes(32).toString("hex");

//     // ✅ Store session token in database
//     user.sessionToken = sessionToken;
//     user.sessionTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
//     await user.save();

//     // ✅ Set Cookie (Securely)
//     const cookie = serialize("sessionToken", sessionToken, {
//       httpOnly: true,
//       path: "/",
//       maxAge: 60 * 60, // 1 hour
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Lax",
//     });

//     // ✅ Send Response with Cookie and Redirect to /journal
//     return new Response(null, {
//       status: 302,
//       headers: {
//         Location: "/journal", // Redirect to /journal
//         "Set-Cookie": cookie, // Set the session cookie
//       },
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
