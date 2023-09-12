import { Session, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";

type SessionCallback = {
  session: Session;
  token: JWT;
};

export const session = async ({ session, token }: SessionCallback) => {
  session.user.id = token.id as string;

  return session;
};

export const getUserSession = async () => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  });
  if (!authUserSession) throw new Error("Session not found");
  return authUserSession.user;
};
