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
    <div className="p-0">
      <div className="flex items-center justify-center h-20 font-bold bg-[var(--blue)]">
        <h1 className="text-5xl font-[var(--font-sketch)] text-[var(--background)]">{isRegistering ? "SIGN UP" : "LOGIN"}</h1>
      </div>
      
      <div className="m-4 flex flex-col gap-5">
        <form onSubmit={handleEmailAuth} className="flex flex-col">
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-[75%] self-center px-4 py-2 text-xl rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-[75%] self-center px-4 py-2 text-xl rounded"
            />
            {error && <p className="">{error}</p>}

          </div>
          <button type="submit" className="mt-5 px-4 py-2 self-center bg-[var(--pink)] text-white text-xl rounded hover:shadow-lg hover:text-[var(--background)]">
            {isRegistering ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="flex flex-col">
          <button onClick={signInWithGoogle} className="text-lg hover:text-white">
            Sign in with Google
          </button>

          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="bg-[var(--foreground)] text-white self-center px-4 py-2 rounded mt-3 hover:shadow-lg hover:text-[var(--background)]"
          >
            {isRegistering ? "Already have an account? Log in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
