"use client"

import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

export default function CreateFlashcardSet() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [cards, setCards] = useState([{ term: "", definition: ""}]);
    const [error, setError] = useState("");
    const router = useRouter();
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    })

    const handleAddCard = () => {
        if (cards.length < 500) {
            setCards([...cards, { term: "", definition: "" }]);
        } else {
            setError("Limit 500 cards per set");
        }
    };

    const handleCardChange = (index, field, value) => {
        const updatedCards = [...cards];
        updatedCards[index][field] = value;
        setCards(updatedCards);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !category) {
            setError("Title and Category required");
            return;
        }

        try {
            await addDoc(collection(db, "flashcardSets"), {
                userId: user.uid,
                title,
                category,
                cards,
                createdAt: new Date(),
            });
            router.push("/");
        } catch (err) {
            console.error("Error creating flashcard set: ", err);
            setError("Failed to create flashcard set");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold">Create Flashcard Set</h1>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded"
            />
            
            {cards.map((card, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Term"
                  value={card.term}
                  onChange={(e) => handleCardChange(index, "term", e.target.value)}
                  className="w-1/2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Definition"
                  value={card.definition}
                  onChange={(e) =>
                    handleCardChange(index, "definition", e.target.value)
                  }
                  className="w-1/2 p-2 border rounded"
                />
              </div>
            ))}
    
            <button
              type="button"
              onClick={handleAddCard}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Card
            </button>
    
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Save Flashcard Set
            </button>
          </form>
        </div>
    );
}