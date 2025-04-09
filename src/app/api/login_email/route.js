// import { NextResponse } from "next/server";
// import Connection from "../../dbconfig/dbconfig";
// import User from "../../../../model/UserModel";

// export async function GET(req) {
//   try {
//     await Connection();

//     const { searchParams } = new URL(req.url);
//     const token = searchParams.get("token");

//     if (!token) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 400 });
//     }

//     // Find user with token
//     const user = await User.findOne({ token });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 400 });
//     }

//     // Clear token after login
//     user.token = null;
//     await user.save();

//     // Redirect to journal page
//     return NextResponse.redirect("http://localhost:3000/journal", 302);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }






import { NextResponse } from "next/server";
import Connection from "../../dbconfig/dbconfig";
import User from "../../../../model/UserModel";
import { signIn } from "next-auth/react"; // Import the signIn function from NextAuth

export async function GET(req) {
  try {
    await Connection();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Find user with token
    const user = await User.findOne({ token });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // Clear token after login
    user.token = null;
    await user.save();

    // Sign in the user using NextAuth (manually create session)
    const res = await signIn("credentials", {
      redirect: false,
      email: user.email, // Email here to manually sign in the user
    });

    if (res?.error) {
      return NextResponse.json({ error: res.error }, { status: 500 });
    }

    // Redirect to the journal page
    return NextResponse.redirect("http://localhost:3000/journal", 302);
  } catch (error) {
    console.error("Error occurred during the process:", error.message);
    return NextResponse.json({ error: `An error occurred: ${error.message}` }, { status: 500 });
  }
}


