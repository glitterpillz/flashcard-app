"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import Link from "next/link";
import Modal from "./modal/page";
import { BsFillLightningFill } from "react-icons/bs";
import ConfirmDeleteModal from "./confirmDeleteModal/page";

export default function DashboardPage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [categories, setCategories] = useState([]);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [deleteSet, setDeleteSet] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleDeleteClick = (set) => {
    setDeleteSet(set);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteSet) return;
    const setId = deleteSet.id;
    const category = deleteSet.category;

    try {
      await deleteDoc(doc(db, "flashcardSets", setId));

      const updatedSets = flashcardSets.filter((set) => set.id !== setId);
      setFlashcardSets(updatedSets);

      const remainingSets = updatedSets.filter((set) => set.category === category);
      if (remainingSets.length === 0) {
        setCategories((prev) => prev.filter((cat) => cat !== category));
      }

      setIsDeleteModalOpen(false);
      setDeleteSet(null);
    } catch (err) {
      console.error("Error deleting flashcard set:", err);
    }
  };

  const openModal = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
    setFlipped(false);
  };

  const closeModal = () => {
    setSelectedSet(null);
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % selectedSet.cards.length);
    setFlipped(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => 
        prev === 0 ? selectedSet.cards.length - 1 : prev - 1
    );
    setFlipped(false);
  };

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
    <div className="p-0">
      <div className="flex items-center justify-center h-20 font-bold bg-[var(--blue)]">
        <h1 className="flex text-6xl font-[var(--font-sketch)] text-[var(--background)]">
          FLASH
            <span>
              <BsFillLightningFill 
                className="text-[var(--lt-pink)]"
              />
            </span>
          APP
        </h1>
      </div>

      <div className="flex items-center justify-center my-4">
        <Link href="/create">
          <button className="px-4 py-2 bg-[var(--lt-pink)] text-white rounded">
            Create Flashcard Set
          </button>
        </Link>
      </div>

      <div className="bg-[var(--blue)] mx-4 rounded p-4">
        <h2 className="text-2xl font-semibold mb-2">Libraries</h2>
        <hr></hr>
        <div className="space-y-2 text-xl mt-2">
          {categories.map((category) => (
            <Link key={category} href={`/category/${category}`} className="block text-[var(--background)]">
              ▶ {category}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-[var(--blue)] m-4 mt-5 rounded p-4">
        <h2 className="text-2xl font-semibold mb-2">Flashcard Sets</h2>
        <hr></hr>
        <div className="space-y-2 text-xl mt-2 flex flex-col items-start text-[var(--background)]">
          {flashcardSets.map((set) => (
            <div key={set.id} className="flex justify-between w-full">
              <button
                onClick={() => openModal(set)}
              >
                ▻ {set.title}
              </button>
              <button
                className="text-[var(--lt-pink)] hover:text-[var(--pink)]"
                onClick={() => handleDeleteClick(set)}
              >
                ✖
              </button>
            </div>
          ))}

          <ConfirmDeleteModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            setTitle={deleteSet?.title}
          />
        </div>
      </div>

      {selectedSet && (
        <Modal
          selectedSet={selectedSet}
          currentCardIndex={currentCardIndex}
          closeModal={closeModal}
          nextCard={nextCard}
          prevCard={prevCard}
          flipped={flipped}
          setFlipped={setFlipped}
        />
      )}

      <div className="mt-5 flex items-center justify-center">
        <button onClick={handleLogout} className="px-4 py-2 bg-[var(--pink)] text-white rounded">
          Logout
        </button>
      </div>
    </div>
  );
}