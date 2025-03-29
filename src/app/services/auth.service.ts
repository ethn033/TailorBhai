import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  User, 
  signInWithEmailAndPassword,
  signOut, 
  authState
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/LoginRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router = inject(Router);

  authState$ = authState(this.auth);

  constructor() {
    this.authState$.subscribe(user => {
      if (user) {
        this.router.navigate(['admin']);
      } else {
        this.router.navigate(['auth']);
      }
    });
  }

  // Sign in with email/password
  async signIn({ email, password }: LoginRequest): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Sign up with email/password
  // async signUp({ email, password, name }: SignUpRequest): Promise<void> {
  //   try {
  //     const credential = await createUserWithEmailAndPassword(this.auth, email, password);
  //     if (this.auth.currentUser) {
  //       await updateProfile(this.auth.currentUser, { displayName: name });
  //     }
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.clear();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get current user
  getCurrentUser(): Observable<User | null> {
    return this.authState$;
  }

  // Error handling
  private handleError(error: unknown): Error {
    let message = 'Authentication failed';
    if (error instanceof Error && 'code' in error) {
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Invalid email';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Invalid email or password';
          break;
        case 'auth/email-already-in-use':
          message = 'Email already in use';
          break;
      }
    }
    return new Error(message);
  }
}