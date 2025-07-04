import { Injectable } from "@angular/core";
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "@angular/fire/auth";
import {
  Firestore,
  doc,
  setDoc,
  serverTimestamp,
} from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  // Test Message
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private firestore: Firestore) {
    this.auth.onAuthStateChanged((user) => {
      this.user$.next(user);
      if (user) {
        this.saveUserDetails(user); // 🔁 update Firestore on every auth change
      }
    });
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      this.user$.next(result.user);
      console.log("✅ User logged in:", result.user);

      // 🔁 Persist to Firestore
      await this.saveUserDetails(result.user);
    } catch (err) {
      console.error("❌ Login failed:", err);
    }
  }

  async logout() {
    await signOut(this.auth);
    this.user$.next(null);
  }

  private async saveUserDetails(user: User) {
    const userRef = doc(this.firestore, "userDetails", user.uid);
    await setDoc(
      userRef,
      {
        name: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ); // merge to avoid overwriting existing fields
  }
}
