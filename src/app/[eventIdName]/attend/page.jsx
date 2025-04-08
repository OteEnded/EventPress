"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Modal from "@/ui/modals/InformationModal";
import TermsOfService from "@/ui/modals/TermsOfService";
import PrivacyPolicy from "@/ui/modals/PrivacyPolicy";

export default function AttendEventPage() {
  const router = useRouter();
  const { eventIdName } = useParams();
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreement, setAgreement] = useState(false);
  
  // Modal state
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Form validation
  const validateForm = () => {
    if (!firstName.trim()) {
      setError("กรุณากรอกชื่อ");
      return false;
    }
    if (!lastName.trim()) {
      setError("กรุณากรอกนามสกุล");
      return false;
    }
    if (!agreement) {
      setError("กรุณายอมรับนโยบายความเป็นส่วนตัวและข้อตกลงการใช้งาน");
      return false;
    }
    setError("");
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await fetch("/api/data/event/attendee/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: eventIdName,
          firstname: firstName,
          lastname: lastName,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }
      
      // Show success message
      setSuccess(true);
      
      // Clear form
      setFirstName("");
      setLastName("");
      setAgreement(false);
      
      // Navigate back after 3 seconds
      setTimeout(() => {
        router.back();
      }, 3000);
      
    } catch (error) {
      setError(error.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If success, show thank you message
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] px-4 py-8 text-gray-700 dark:text-gray-200 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">ขอบคุณสำหรับการลงทะเบียน!</h1>
          <p className="mb-6">การลงทะเบียนเข้าร่วมกิจกรรมของคุณสำเร็จแล้ว</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">กำลังนำคุณกลับ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] px-4 py-8 text-gray-700 dark:text-gray-200 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          กลับ
        </button>
        
        <h1 className="text-2xl font-bold mb-6 text-center">ลงทะเบียนเข้าร่วมกิจกรรม</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block mb-2 font-medium">
              ชื่อ
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="กรอกชื่อของคุณ"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="lastName" className="block mb-2 font-medium">
              นามสกุล
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="กรอกนามสกุลของคุณ"
              disabled={isSubmitting}
              required
            />
          </div>
          
          {/* Terms & Agreement */}
          <div className="mb-6">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="terms"
                className="h-5 w-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                required
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
                disabled={isSubmitting}
              />
              <span className="ml-2.5 text-sm text-gray-600 dark:text-gray-300">
                ฉันยอมรับ{" "}
                <button
                  type="button"
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-blue-600 dark:text-blue-400 hover:underline mx-1 font-medium"
                >
                  นโยบายความเป็นส่วนตัว
                </button>
                และ{" "}
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(true)}
                  className="text-blue-600 dark:text-blue-400 hover:underline mx-1 font-medium"
                >
                  ข้อตกลงการใช้งาน
                </button>
                ของ EventPress
              </span>
            </label>
          </div>
          
          <button
            type="submit"
            className={`w-full py-3 px-4 text-white font-medium rounded-lg text-center ${
              isSubmitting 
                ? "bg-blue-400 dark:bg-blue-600 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            } transition`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "กำลังลงทะเบียน..." : "ลงทะเบียนเข้าร่วม"}
          </button>
        </form>
      </div>
      
      {/* Modals */}
      <Modal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        title="ข้อตกลงการใช้งาน"
      >
        <TermsOfService />
      </Modal>

      <Modal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        title="นโยบายความเป็นส่วนตัว"
      >
        <PrivacyPolicy />
      </Modal>
    </div>
  );
}