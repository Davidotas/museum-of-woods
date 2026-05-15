import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@museumofwoods.co'
const ADMIN_PASS  = process.env.ADMIN_PASSWORD || 'museum2024'

export const authOptions = {
  providers: [
    // Google OAuth — works once GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET are set
    ...(process.env.GOOGLE_CLIENT_ID ? [
      GoogleProvider({
        clientId:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt:        'consent',
            access_type:   'offline',
            response_type: 'code',
          },
        },
      }),
    ] : []),

    // Email + Password credentials
    CredentialsProvider({
      id:   'credentials',
      name: 'Email',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
        // Registration fields (optional)
        name:     { label: 'Name',     type: 'text'     },
        action:   { label: 'Action',   type: 'text'     }, // 'login' | 'register'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Admin shortcut
        if (
          credentials.email    === ADMIN_EMAIL &&
          credentials.password === ADMIN_PASS
        ) {
          return { id: 'admin', name: 'Admin', email: ADMIN_EMAIL, role: 'admin' }
        }

        // For registered customers: validate against the /api/auth/users endpoint
        try {
          const baseUrl = process.env.NEXTAUTH_URL || 'https://museumofwood.com'
          const res = await fetch(`${baseUrl}/api/auth/users`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action:   credentials.action || 'login',
              email:    credentials.email,
              password: credentials.password,
              name:     credentials.name || '',
            }),
          })
          const data = await res.json()
          if (data.user) return data.user
        } catch {}

        return null
      },
    }),
  ],

  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 days

  pages: {
    signIn:   '/auth/signin',
    newUser:  '/auth/signup',
    error:    '/auth/signin',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user)    token.role  = user.role || 'customer'
      if (account) token.provider = account.provider
      return token
    },
    async session({ session, token }) {
      session.user.role     = token.role     || 'customer'
      session.user.provider = token.provider || 'credentials'
      return session
    },
  },

  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
