import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const AUTH_USERNAME = 'shafi'
const AUTH_PASSWORD = '1234'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-me',
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim()
        const password = credentials?.password

        if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
          return null
        }

        return {
          id: 'shafi-admin',
          name: AUTH_USERNAME,
          email: 'shafi@example.com',
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name
        token.email = user.email
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name ?? session.user.name
        session.user.email = token.email ?? session.user.email
      }

      return session
    },
  },
}