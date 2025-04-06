"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteActivityModal({ isOpen, onClose, activityId, activityName, boothId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/data/activity/delete/${activityId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete activity");
      }

      // Close both modals (Edit and Delete)
      onClose();
      
      // Force a hard refresh to ensure latest data is loaded
      window.location.reload();
      
    } catch (error) {
      console.error("Error deleting activity:", error);
      setError(error.message || "An error occurred while deleting the activity.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* Modal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 relative z-10">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          ยืนยันการลบกิจกรรม
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรม <strong className="dark:text-white">{activityName}</strong>?
        </p>

        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="ml-3 text-red-700 dark:text-red-400 font-medium">
              คำเตือน: การกระทำนี้ไม่สามารถย้อนกลับได้!
            </p>
          </div>
          <p className="text-red-700 dark:text-red-400 mt-2">
            การลบกิจกรรมนี้จะทำให้ข้อมูลกิจกรรมหายไปทั้งหมด
          </p>
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
            disabled={isDeleting}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
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
                กำลังลบ...
              </>
            ) : (
              "ลบกิจกรรม"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}