import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth/next-auth-options";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
// export default NextAuth(authOptions);