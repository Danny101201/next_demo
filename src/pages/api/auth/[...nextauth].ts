import NextAuth, { AuthOptions, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/server/db"
import bcrypt from 'bcrypt'
export const authOptions: AuthOptions = {
  pages: { signIn: '/' },
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalidate credentials')
        }
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email
          }
        })
        if (!user || !user?.hashedPassword) {
          throw new Error('user credentials not found or user have not register')
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )
        if (!isCorrectPassword) {
          throw new Error('Invalidate password')
        }
        return user
      }
    }),


    // ...add more providers here
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      const userInfo = await prisma.user.findFirst({
        where: {
          email: token.email
        }
      })

      if (!userInfo) return token
      return { ...token, ...userInfo }
    },
    session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.id } }
    },
  },
  session: {
    strategy: 'jwt',
    // maxAge: 1 * 24 * 60 * 60
  }
  // No adapter, strategy: "jwt": This is the default.The session is saved in a cookie and never persisted anywhere.
  // With Adapter, strategy: "database": If an Adapter is defined, this will be the implicit setting.No user config is needed.
  // With Adapter, strategy: "jwt": The user can explicitly instruct next- auth to use JWT even if a database is available.This can result in faster lookups in compromise of lowered security.Read more about: https://next-auth.js.org/faq#json-web-tokens
  // https://github.com/nextauthjs/next-auth/pull/3144
}
export default NextAuth(authOptions)
