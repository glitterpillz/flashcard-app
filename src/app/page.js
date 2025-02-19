"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation";
import { auth } from "@firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push("/login");
    }).catch((error) => {
      console.error("Error logging out: ", error);
    });
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h1>FLASHCARD APP</h1>
      </div>

      <div>
        <button>
          Create Flashcard Set
        </button>
        <div>
          FLASHCARD SETS DIV
        </div>
      </div>
      
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}