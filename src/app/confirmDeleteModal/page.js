"use client";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, setTitle }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[var(--foreground)] p-6 rounded-lg shadow-lg w-[90%] relative">
                <h2 className="text-center text-lg font-bold mb-4">Delete Flashcard Set</h2>
                <p className="text-center">Are you sure you want to permanently delete <strong>{setTitle}</strong>?</p>
                <div className="mt-4 flex justify-center gap-4">
                    <button
                        className="px-4 py-2 bg-[var(--pink)] text-[var(--background)] rounded"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                    <button
                        className="px-4 py-2 bg-[var(--blue)] rounded text-white"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>            
        </div>
    )
}