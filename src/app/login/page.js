"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/"); 
    }
  }, [user, router]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="">
      <div className="">
        <h1 className="">{isRegistering ? "SIGN UP" : "LOGIN"}</h1>
      </div>
      
      <div className="">
        <form onSubmit={handleEmailAuth} className="">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className=""
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className=""
          />
          {error && <p className="">{error}</p>}
          <button type="submit" className="">
            {isRegistering ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="">
          <button onClick={signInWithGoogle} className="">
            Sign in with Google
          </button>

          <button onClick={() => setIsRegistering(!isRegistering)} className="">
            {isRegistering ? "Already have an account? Log in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
