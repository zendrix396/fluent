import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connect from '@/utils/db';
import User from '@/models/User';
import config from '../../../../../config.json';

const handler = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || config.auth.googleClientId,
      clientSecret: process.env.GOOGLE_SECRET || config.auth.googleClientSecret
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            // check password
            const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordCorrect) {
              return user;
            } else {
              throw new Error("Wrong Credentials!");
            }
          } else {
            throw new Error("User not found!");
          }
        } catch (err) {
          throw new Error(err);
        }
      }
    })
  ],
  pages: {
    error: "/auth/error",
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await connect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            const newUser = new User({
              name: user.name,
              email: user.email,
              provider: "google",
              image: user.image,
            });
            await newUser.save();
          }
          return true;
        } catch (err) {
          console.log("Error saving user", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        await connect();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id;
          token.requestCount = dbUser.requestCount;
          token.isPremium = dbUser.isPremium;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.requestCount = token.requestCount;
        session.user.isPremium = token.isPremium;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || config.auth.nextAuthSecret,
});

export { handler as GET, handler as POST };
