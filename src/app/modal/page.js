"use client";

export default function Modal({ 
    selectedSet, 
    currentCardIndex, 
    closeModal, 
    nextCard, 
    prevCard, 
    flipped, 
    setFlipped
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[var(--foreground)] p-6 rounded-lg shadow-lg w-[90%] relative">
                <button
                    className="absolute top-2 right-2 text-[var(--pink)] hover:text-[var(--lt-pink)]"
                    onClick={closeModal}
                >
                    ✖
                </button>
                <h2 
                    className="text-2xl font-bold text-center"
                    style={{
                        color: "var(--background)"
                    }}
                >
                    {selectedSet.title}
                </h2>
                {selectedSet.cards.length > 0 ? (
                    <div
                        className="mt-4 flex flex-col items-center"
                        onClick={() => setFlipped(!flipped)}
                    >
                        <div
                            className={`w-64 h-40 flex items-center justify-center rounded-lg shadow-md cursor-pointer ${
                                flipped ? "bg-[var(--lt-blue)]" : "bg-[var(--blue)]"
                            }`}
                        >
                            <p 
                                className="text-lg font-medium ${"
                                style={{
                                    color: "var(--foreground)"
                                }}
                            >
                                {flipped
                                    ? selectedSet.cards[currentCardIndex].definition
                                    : selectedSet.cards[currentCardIndex].term}
                            </p>
                        </div>
                        <p className="text-sm text-[var(--background)] mt-2">Click to flip</p>
                        <div className="flex justify-between w-full mt-4">
                            <button
                                className="px-4 py-2 bg-[var(--lt-pink)] text-white rounded-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevCard();
                                }}
                            >
                                ◀ Prev
                            </button>
                            <button
                                className="px-4 py-2 bg-[var(--lt-pink)] text-white rounded-lg"
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
        </div>
    );
}
