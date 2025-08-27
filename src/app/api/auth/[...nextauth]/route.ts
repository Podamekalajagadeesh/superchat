import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

const prisma = new PrismaClient()

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email || '',
          name: user.name || '',
          image: user.image || '',
          username: user.username || '',
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser) {
          // Create new user with Google data
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              image: user.image!,
              googleId: profile?.sub,
              isVerified: true,
              username: user.name?.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000)
            }
          })
        } else {
          // Update existing user's Google info
          await prisma.user.update({
            where: { email: user.email! },
            data: {
              googleId: profile?.sub,
              image: user.image!,
              isVerified: true
            }
          })
        }
      }

              if (account?.provider === "github") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Create new user with GitHub data
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image!,
                githubId: (profile as any)?.id?.toString(),
                isVerified: true,
                username: user.name?.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000)
              }
            })
          } else {
            // Update existing user's GitHub info
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                githubId: (profile as any)?.id?.toString(),
                image: user.image!,
                isVerified: true
              }
            })
          }
        }

      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
