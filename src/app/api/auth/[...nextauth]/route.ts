import dbConnect from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import bcrypt from "bcryptjs";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Define interfaces for user and session
interface User {
  _id: string;
  username: string;
  is_SupperAdmin: boolean;
  // Add other user properties here if needed
}

const authOptions: AuthOptions = {
  pages: { signIn: "/login" }, // when without user route  access then login page redirect
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any) => {
        try {
          await dbConnect();
          const user = await AdminUser.findOne({
            username: credentials.username,
          });
          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordsMatch) {
            return null;
          }

          // console.log("User logged in successfully", user);
          return user;
        } catch (error) {
          console.log("error message", error);
          // throw new Error("Failed to login ");
          return error;
        }
      },
    }),
  ],
  callbacks: {
    // signIn optional
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },

    async jwt({ token, account, user }) {
      if (user) {
        token.id = (user as any)._id;
        token.username = (user as any).username;
        token.is_SupperAdmin = (user as any).is_SupperAdmin;
      }

      return token;
    },
    async session({ session, user, token }) {
      if (token) {
        session.user = {
          ...(session.user || {}), // Ensure session.user exists
          name: token?.username as string,
          id: token.id,
          is_SupperAdmin: token.is_SupperAdmin,
        } as {
          name?: string | null | undefined;
          email?: string | null | undefined;
          image?: string | null | undefined;
          id: string;
          is_SupperAdmin: boolean;
        };
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
