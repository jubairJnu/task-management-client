
import config from "@/config";
import DecodeJwt from "@/utils/DecodeJwt";
import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
interface CustomJwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
  iat?: number;
  exp?: number;
  iss?: string;
  sub?: string;
}
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        email: { label: "email", type: "text", placeholder: "Enter email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const payload = {
          email: credentials?.email,
          password: credentials?.password,
        };
        try {
          const res = await axios.post(`${config.api_url}/auth/login`, payload);
          const tokens = res?.data?.data;
          if (tokens?.accessToken) {
            // Decode the JWT token to extract user information
            const decodedToken = DecodeJwt(
              tokens.accessToken
            ) as CustomJwtPayload;

            return {
              id: decodedToken?.id,
              email: decodedToken?.email,
              role: decodedToken?.role,
              name: decodedToken?.name,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      // On initial login
      if (user) {
        token.accessToken = user.accessToken ;
        token.refreshToken = user.refreshToken;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.sub,
        email: token.email as string | undefined,
        role: token.role as string,
      };
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  secret: config.next_auth_secret,
});

export { handler as GET, handler as POST };
