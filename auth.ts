import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { User } from '@/app/lib/definition';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { authConfig } from './auth.config';
import { z } from 'zod';
 
const sql = postgres(process.env.DATABASE_URL, { ssl: false });
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (!passwordsMatch) return null;

          return { 
            id: user.id.toString(), 
            email: user.email, 
            role_id: user.role_id.toString(),
          };
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    // Adds custom data to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role_id = user.role_id;
      }
      return token;
    },
    // Adds custom data from the JWT to the session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role_id = token.role_id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
