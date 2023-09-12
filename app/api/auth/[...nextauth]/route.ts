import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
  },
});

export { handler as GET, handler as POST };
