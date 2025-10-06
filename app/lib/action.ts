'use server';
 
import sql from '@/app/lib/db';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { User } from '@/lib/definition';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function getUsers() {
  try {
    const users = await sql<User[]>`SELECT * FROM users`;
    return users;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}
