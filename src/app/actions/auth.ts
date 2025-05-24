'use server'

import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { cookies } from 'next/headers'

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const token = await userCredential.user.getIdToken()
    
    // Set new session cookie
    const cookieStore = await cookies();
    cookieStore.set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    })
    
    return { success: true }
  } catch (error: unknown) {
    const firebaseError = error as import('firebase/app').FirebaseError;
    return { 
      success: false, 
      error: firebaseError.message || 'Invalid credentials' 
    }
  }
}

export async function signOut() {
  try {
    await auth.signOut()
    const cookieStore = await cookies()
    cookieStore.delete('admin-session')
    return { success: true }
  } catch {
    return { success: false }
  }
}