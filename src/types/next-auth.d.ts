import { DefaultSession } from "next-auth";
import { DemoRole } from "../lib/auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: DemoRole;
      dashboardRoute?: "/admin" | "/supervisor" | "/client";
    };
  }

  interface User {
    role?: DemoRole;
    dashboardRoute?: "/admin" | "/supervisor" | "/client";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: DemoRole;
    dashboardRoute?: "/admin" | "/supervisor" | "/client";
  }
}
