"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import Modal from "@/app/modal/page";

export default function CategoryPage() {
    const router = useRouter();
    const { category: rawCategory } = useParams();
    const [category, setCategory] = useState(decodeURIComponent(rawCategory));
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        setCategory(decodeURIComponent(rawCategory));
    }, [rawCategory]); // Update state only if param changes
    
    useEffect(() => {
        const fetchSets = async () => {
            const setQuery = query(
                collection(db, "flashcardSets"),
                where("category", "==", category)
            );
            const querySnapshot = await getDocs(setQuery);
            setFlashcardSets(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };
        if (category) fetchSets();
    }, [category]);

    const handleEdit = (set) => {
        router.push(`/edit-flashcard-set?id=${set.id}`)
    }

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

    const handleGoHome = () => {
        router.push("/");
    };

    return (
        <div className="p-0">
            <div className="flex items-center justify-center h-20 font-bold bg-[var(--blue)]">
                <h1 
                    className="text-5xl font-[var(--font-sketch)] text-[var(--background)]"
                >
                    {category}
                </h1>
            </div>


            <div className="my-8 mx-16">
            {flashcardSets.map((set) => (
                <div key={set.id} className="flex justify-between items-center my-2">
                    <button
                        onClick={() => openModal(set)}
                        className="bg-[var(--foreground)] text-[var(--background)] flex-1 py-2 rounded shadow-md text-lg"
                    >
                        {set.title}
                    </button>
                    <button
                        onClick={() => handleEdit(set)}
                        className="ml-4 px-3 py-2 bg-[var(--blue)] text-white rounded"
                    >
                        Edit
                    </button>
                </div>
            ))}
            </div>

            {/* Pass currentCardIndex and other necessary props to the Modal component */}
            {selectedSet && (
                <Modal
                    selectedSet={selectedSet}
                    currentCardIndex={currentCardIndex}  // Add this line
                    closeModal={closeModal}
                    nextCard={nextCard}
                    prevCard={prevCard}
                    flipped={flipped}
                    setFlipped={setFlipped}
                />
            )}
            <div className="flex flex-col items-center">
                <button 
                    onClick={handleGoHome}
                    className="px-4 py-2 bg-[var(--pink)] text-white rounded"
                >
                    Home
                </button>
            </div>
        </div>
    );
}
