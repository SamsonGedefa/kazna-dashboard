import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import jwt from "jsonwebtoken";
export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      async authorize(credentials) {
        const user = await findUserByEmail(credentials.email);

        if (!user) {
          throw new Error("Email not found");
        }

        const verifyPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!verifyPassword) {
          throw new Error("Wrong password");
        }

        return user;
      },
    }),

    // CredentialsProvider({
    //   id: "verify-email",
    //   async authorize(token, email) {
    //     const isValid = await new Promise((resolve) => {
    //       jwt.verify(
    //         token,
    //         process.env.NEXTAUTH_PROVIDER_EMAIL_VERIFICATION_SECRET + email,
    //         (err) => {
    //           if (err) resolve(false);
    //           if (!err) resolve(true);
    //         }
    //       );
    //     });
    //   },
    // }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },

  debug: true,
  secret: process.env.NEXT_AUTH_SECRET,
});
