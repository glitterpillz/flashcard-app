"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";

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
        router.push("/")
    }

    return (
        <div className="p-4">
            <h1>Category: {category}</h1>
            <div>
                {flashcardSets.map((set) => (
                    <button
                        key={set.id}
                        onClick={() => openModal(set)}
                    >
                        {set.title}
                    </button>
                ))}
            </div>

            {selectedSet && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                            onClick={closeModal}
                        >
                            ✖
                        </button>
                        <h2 className="text-xl font-bold text-center">{selectedSet.title}</h2>
                        {selectedSet.cards.length > 0 ? (
                            <div
                                className="mt-4 flex flex-col items-center"
                                onClick={() => setFlipped(!flipped)}
                            >
                                <div className="w-64 h-40 bg-gray-200 flex items-center justify-center rounded-lg shadow-md cursor-pointer">
                                    <p className="text-lg font-medium">
                                        {flipped
                                            ? selectedSet.cards[currentCardIndex].definition
                                            : selectedSet.cards[currentCardIndex].term}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Click to flip</p>
                                <div className="flex justify-between w-full mt-4">
                                    <button
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            prevCard();
                                        }}
                                    >
                                        ◀ Prev
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextCard();
                                        }}
                                    >
                                        Next ▶
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 mt-4">No cards in this set</p>
                        )}
                    </div>
                    <div>
                        <button onClick={handleGoHome}>Home</button>
                    </div>
                </div>
            )}
        </div>
    )
}