import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { session } from "@/lib/auth";
import { redirect } from "next/navigation";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      await prisma.user.upsert({
        where: { email: user.email },

        create: {
          email: user.email,
          name: user.name,
          avatar: user.image,
          tenantUserRelations: {
            create: {
              tenant: {
                create: {},
              },
              role: "OWNER",
            },
          },
        },

        update: {
          name: user.name,
          avatar: user.image,
        },
      });

      return true;
    },

    session,

    async jwt({ token }) {
      if (token.email) {
        const user = await prisma.user.findUnique({
          where: { email: token.email },
        });

        if (!user) throw new Error("User not found");

        token.id = user.id;
      }

      return token;
    },
  },
});

export { handler as GET, handler as POST };
