// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import User from "../../../../../model/UserModel";
// import Connection from "@/app/dbconfig/dbconfig";
// // import EmailProvider from "next-auth/providers/email";

// const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     EmailProvider({
//       server: process.env.EMAIL_SERVER,
//       from: process.env.EMAIL_FROM,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       try {
//         await Connection(); // Ensure DB is connected

//         let existingUser = await User.findOne({ email: user.email });

//         if (!existingUser) {
//           // Save new user
//           existingUser = await User.create({
//             name: user.name,
//             email: user.email,
//             image: user.image,
//             googleId: account.providerAccountId,
//             accessToken: account.access_token,
//             refreshToken: account.refresh_token,
//           });
//         } else {
//           // Update tokens on re-login
//           existingUser.accessToken = account.access_token;
//           existingUser.refreshToken = account.refresh_token;
//           await existingUser.save();
//         }

//         return true;
//       } catch (error) {
//         console.error("Error saving user:", error);
//         return false;
//       }
//     },

//     // Fetch user data from the database in session callback
//     async session({ session }) {
//       try {
//         await Connection();

//         // Fetch updated user info from the DB
//         const userFromDb = await User.findOne({ email: session.user.email });

//         if (userFromDb) {
//           session.user.id = userFromDb._id;
//           session.user.name = userFromDb.name;
//           session.user.email = userFromDb.email;
//           session.user.image = userFromDb.image;
//           session.user.accessToken = userFromDb.accessToken; // Updated token from DB
//         }
//       } catch (error) {
//         console.error("Error fetching user from DB:", error);
//       }

//       return session;
//     },

//     async jwt({ token, user, account }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };



// Usman bhai code
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import User from "../../../../../model/UserModel";
// import Connection from "@/app/dbconfig/dbconfig";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";


// const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       try {
//         await Connection(); // Ensure DB is connected

//         let existingUser = await User.findOne({ email: user.email });

//         if (!existingUser) {
//           // Save new user
//           existingUser = await User.create({
//             name: user.name || "User",
//             email: user.email,
//             image: user.image || "",
//             googleId:
//               account.provider === "google" ? account.providerAccountId : null,
//             accessToken: account.access_token || null,
//             refreshToken: account.refresh_token || null,
//           });
//         } else {
//           // Update tokens only if logging in with Google
//           if (account.provider === "google") {
//             existingUser.googleId = account.providerAccountId;
//             existingUser.accessToken = account.access_token;
//             existingUser.refreshToken = account.refresh_token;
//             await existingUser.save();
//           }
//         }

//         return true;
//       } catch (error) {
//         console.error("Error saving user:", error);
//         return false;
//       }
//     },

//     async session({ session }) {
//       try {
//         await Connection();

//         // Fetch updated user info from the DB
//         const userFromDb = await User.findOne({ email: session.user.email });

//         if (userFromDb) {
//           session.user.id = userFromDb._id;
//           session.user.name = userFromDb.name;
//           session.user.email = userFromDb.email;
//           session.user.image = userFromDb.image;
//           session.user.accessToken = userFromDb.accessToken || null;
//         }
//       } catch (error) {
//         console.error("Error fetching user from DB:", error);
//       }

//       return session;
//     },
//     pages: {
//       signIn: "/login",
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };




// // Sufi Code 
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import User from "../../../../../model/UserModel";
// import Connection from "@/app/dbconfig/dbconfig"; // Ensure this path is correct

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       try {
//         await Connection(); // Ensure DB is connected

//         let existingUser = await User.findOne({ email: user.email });

//         if (!existingUser) {
//           // Save new user
//           existingUser = await User.create({
//             name: user.name || "User",
//             email: user.email,
//             image: user.image || "",
//             googleId:
//               account.provider === "google" ? account.providerAccountId : null,
//             accessToken: account.access_token || null,
//             refreshToken: account.refresh_token || null,
//           });
//         } else {
//           // Update tokens only if logging in with Google
//           if (account.provider === "google") {
//             existingUser.googleId = account.providerAccountId;
//             existingUser.accessToken = account.access_token;
//             existingUser.refreshToken = account.refresh_token;
//             await existingUser.save();
//           }
//         }

//         return true;
//       } catch (error) {
//         console.error("Error saving user:", error);
//         return false;
//       }
//     },

//     async session({ session }) {
//       try {
//         await Connection();

//         // Fetch updated user info from the DB
//         const userFromDb = await User.findOne({ email: session.user.email });

//         if (userFromDb) {
//           session.user.id = userFromDb._id.toString();
//           session.user.name = userFromDb.name;
//           session.user.email = userFromDb.email;
//           session.user.image = userFromDb.image;
//           session.user.accessToken = userFromDb.accessToken || null;
//         }
//       } catch (error) {
//         console.error("Error fetching user from DB:", error);
//       }

//       return session;
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },
// };

// // Initialize NextAuth handler
// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };









import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "../../../../../model/UserModel";
import Connection from "@/app/dbconfig/dbconfig";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await Connection(); // Ensure DB is connected

        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Save new user
          existingUser = await User.create({
            name: user.name || "User",
            email: user.email,
            image: user.image || "",
            googleId: account.provider === "google" ? account.providerAccountId : null,
            accessToken: account.access_token || null,
            refreshToken: account.refresh_token || null,
          });
        } else {
          // Update tokens only if logging in with Google
          if (account.provider === "google") {
            existingUser.googleId = account.providerAccountId;
            existingUser.accessToken = account.access_token;
            existingUser.refreshToken = account.refresh_token;
            await existingUser.save();
          }
        }

        return true;
      } catch (error) {
        console.error("Error saving user:", error);
        return false;
      }
    },

    async session({ session, user }) {
      try {
        await Connection();

        // Fetch updated user info from the DB
        const userFromDb = await User.findOne({ email: session.user.email });

        if (userFromDb) {
          session.user.id = userFromDb._id.toString();
          session.user.name = userFromDb.name;
          session.user.email = userFromDb.email;
          session.user.image = userFromDb.image;
          session.user.accessToken = userFromDb.accessToken || null;
        }
      } catch (error) {
        console.error("Error fetching user from DB:", error);
      }

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
  },
};

// Initialize NextAuth handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

