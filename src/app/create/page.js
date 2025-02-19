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

    const handleCancel = () => {
      router.push("/");
    }

    return (
        <div className="">
          <div className="flex items-center justify-center h-20 font-bold bg-[var(--blue)]">
            <h1 className="text-4xl font-[var(--font-sketch)]">Create Flashcard Set</h1>
          </div>
          {error && <p className="text-[var(--pink)]">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4 m-4 flex flex-col">
            <div className="p-2 bg-[var(--lt-pink)] rounded flex flex-col gap-2">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Library"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="flex flex-col gap-3">
              {cards.map((card, index) => (
                <div key={index} className="flex flex-col gap-2 bg-[var(--blue)] p-2 rounded">
                  <input
                    type="text"
                    placeholder="Term"
                    value={card.term}
                    onChange={(e) => handleCardChange(index, "term", e.target.value)}
                    className="p-2 rounded"
                  />
                  <textarea
                    type="text"
                    placeholder="Definition"
                    value={card.definition}
                    onChange={(e) =>
                      handleCardChange(index, "definition", e.target.value)
                    }
                    className="p-2 rounded"
                  />
                </div>
              ))}
            </div>
    
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleAddCard}
                className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded"
              >
                Add Card
              </button>
      
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--lt-pink)] text-white rounded"
              >
                Save Flashcard Set
              </button>
            </div>
            <button 
              className="self-end"
              onClick={handleCancel}  
            >
              Cancel
            </button>
          </form>
        </div>
    );
}