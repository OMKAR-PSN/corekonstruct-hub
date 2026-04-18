import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type DemoRole = "admin" | "supervisor" | "client";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: DemoRole;
  dashboardRoute: "/admin" | "/supervisor" | "/client";
};

export const demoUsers: DemoUser[] = [
  {
    id: "admin",
    name: "CoreKonstruct Admin",
    email: "admin@corekonstruct.com",
    password: "Admin#2026",
    role: "admin",
    dashboardRoute: "/admin",
  },
  {
    id: "supervisor",
    name: "CoreKonstruct Supervisor",
    email: "supervisor@corekonstruct.com",
    password: "Supervisor#2026",
    role: "supervisor",
    dashboardRoute: "/supervisor",
  },
  {
    id: "client",
    name: "CoreKonstruct Client",
    email: "client@corekonstruct.com",
    password: "Client#2026",
    role: "client",
    dashboardRoute: "/client",
  },
];

export function findDemoUser(email?: string, password?: string) {
  const normalizedEmail = email?.trim().toLowerCase();
  return demoUsers.find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === password,
  );
}

const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "corekonstruct-demo-secret";

export const authOptions: NextAuthOptions = {
  secret,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Demo Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = findDemoUser(credentials?.email, credentials?.password);

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          dashboardRoute: user.dashboardRoute,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.dashboardRoute = user.dashboardRoute;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as DemoRole | undefined;
        session.user.dashboardRoute = token.dashboardRoute as "/admin" | "/supervisor" | "/client" | undefined;
      }

      return session;
    },
  },
};
