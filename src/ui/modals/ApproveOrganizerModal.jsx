"use client";

import { useState } from "react";

export default function ApproveOrganizerModal({ isOpen, onClose, organizerId, organizerName, onApprove }) {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleApprove = async () => {
    setIsApproving(true);
    setError("");

    try {
      const response = await fetch(`/api/data/organizer/approve/${organizerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to approve organizer");
      }

      const result = await response.json();
      
      // Call the onApprove callback with the updated data
      if (onApprove && typeof onApprove === 'function') {
        onApprove(result.content);
      }
      
      // Close the modal
      onClose();
      
      // Force a hard refresh to ensure latest data is loaded
      window.location.reload();
      
    } catch (error) {
      console.error("Error approving organizer:", error);
      setError(error.message || "An error occurred while approving the organizer.");
      setIsApproving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* Modal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 relative z-10">
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
          ยืนยันการอนุมัติองค์กร
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการอนุมัติองค์กร <strong className="dark:text-white">{organizerName}</strong>?
        </p>

        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="ml-3 text-green-700 dark:text-green-400 font-medium">
              การอนุมัติองค์กรนี้จะทำให้องค์กรสามารถดำเนินการได้เต็มรูปแบบ
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded"
            disabled={isApproving}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center"
            disabled={isApproving}
          >
            {isApproving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                กำลังอนุมัติ...
              </>
            ) : (
              "ยืนยันการอนุมัติ"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}