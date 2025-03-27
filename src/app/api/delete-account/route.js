// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import Connection from "@/app/dbconfig/dbconfig";
// import User from "../../../../model/UserModel";


// export async function DELETE(req) {
//   try {
//     await Connection();

//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return new Response(JSON.stringify({ error: "Unauthorized" }), {
//         status: 401,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const deletedUser = await User.findOneAndDelete({ email: session.user.email });

//     if (!deletedUser) {
//       return new Response(JSON.stringify({ error: "User not found" }), {
//         status: 404,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     return new Response(
//       JSON.stringify({ message: "Account deleted successfully" }),
//       {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   } catch (error) {
//     console.error("Error deleting account:", error);
//     return new Response(
//       JSON.stringify({ error: "Internal Server Error" }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }








import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Connection from "@/app/dbconfig/dbconfig";
import User from "../../../../model/UserModel";
import Chat from "../../../../model/Chat";
import Entries from "../../../../model/EntriesModel";

export async function DELETE(req) {
  try {
    await Connection();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find the user first
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Delete related entries in Chat and Entries tables
    await Chat.deleteMany({ user_id: user._id });
    await Entries.deleteMany({ user_id: user._id });

    // Delete the user account
    await User.findOneAndDelete({ email: session.user.email });

    return new Response(
      JSON.stringify({ message: "Account and related data deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

