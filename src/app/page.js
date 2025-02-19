"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth);
  const [categories, setCategories] = useState([]);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      const querySnapshot = await getDocs(collection(db, "flashcardSets"));
      const sets = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));

      const uniqueCategories = [...new Set(sets.map((set) => set.category))];

      setFlashcardSets(sets);
      setCategories(uniqueCategories);
    };

    fetchFlashcardSets();
  }, []);

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
    <div className="p-4">
      <h1 className="text-2xl font-bold">FLASHCARD APP</h1>

      <div className="my-4">
        <Link href="/create">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Create Flashcard Set
          </button>
        </Link>
      </div>

      <h2 className="text-xl font-semibold">Categories</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <Link key={category} href={`/category/${category}`} className="block text-blue-500">
            {category}
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-4">Your Flashcard Sets</h2>
      <div className="space-y-2">
        {flashcardSets.map((set) => (
          <Link key={set.id} href={`/flashcards/${set.id}`} className="block text-green-500">
            {set.title}
          </Link>
        ))}
      </div>

      <div className="mt-4">
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
          Logout
        </button>
      </div>
    </div>
  );
}