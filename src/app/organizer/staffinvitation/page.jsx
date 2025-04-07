"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import eventPressLogo from "@public/eventpress-logo.png";

export default function StaffInvitationPage() {
  // UI state management
  const [invitationCode, setInvitationCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter code, Step 2: Verify email (if needed), Step 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [staffDetails, setStaffDetails] = useState(null);
  const [verificationRequired, setVerificationRequired] = useState(false);

  // Mock function for next step (will be implemented later)
  const handleCheckCode = () => {
    setLoading(true);
    setTimeout(() => {
      // Mock successful code verification
      if (invitationCode.length >= 4) {
        setStaffDetails({
          eventName: "Web Summit 2023",
          boothCount: 3,
          verification_email: "staff@example.com",
        });

        if (staffDetails?.verification_email) {
          setVerificationRequired(true);
          setStep(2); // Move to verification step
        } else {
          setStep(3); // Skip to success step
        }
      } else {
        setError("รหัสเชิญไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง");
      }
      setLoading(false);
    }, 1000);
  };

  // Mock function for verification (will be implemented later)
  const handleVerifyCode = () => {
    setLoading(true);
    setTimeout(() => {
      if (verificationCode.length >= 4) {
        setStep(3); // Move to success page
      } else {
        setError("รหัสยืนยันไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            ยืนยันคำเชิญสตาฟ
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            ยืนยันรหัสเชิญเพื่อเข้าร่วมงานในฐานะสตาฟ
          </p>
        </div>

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src={eventPressLogo}
            alt="Event Press logo"
            width={150}
            height={150}
            className="cursor-pointer"
          />
        </div>

        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="invitation-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  รหัสเชิญ
                </label>
                <div className="mt-1">
                  <input
                    id="invitation-code"
                    name="invitation-code"
                    type="text"
                    autoComplete="off"
                    required
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    placeholder="กรอกรหัสเชิญ"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  รหัสเชิญจะอยู่ในอีเมลเชิญหรือได้รับจากผู้จัดงาน
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleCheckCode}
                  disabled={loading || !invitationCode}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading || !invitationCode
                      ? "bg-blue-300 dark:bg-blue-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังตรวจสอบ...
                    </>
                  ) : (
                    "ตรวจสอบรหัสเชิญ"
                  )}
                </button>
              </div>

              <div className="text-sm text-center">
                <Link href="/" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  กลับไปยังหน้าหลัก
                </Link>
              </div>
            </div>
          </div>
        )}

        {step === 2 && staffDetails && (
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      เราได้ส่งรหัสยืนยันไปยัง <span className="font-medium">{staffDetails.verification_email}</span>
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">ยืนยันตัวตนด้วยอีเมล</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    กรุณากรอกรหัสยืนยันที่ส่งไปยังอีเมลของคุณ
                  </p>
                </div>

                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  รหัสยืนยัน
                </label>
                <div className="mt-1">
                  <input
                    id="verification-code"
                    name="verification-code"
                    type="text"
                    autoComplete="off"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    placeholder="กรอกรหัสยืนยัน 6 หลัก"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  รหัสนี้จะหมดอายุใน 10 นาที
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={loading || !verificationCode}
                  className={`flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading || !verificationCode
                      ? "bg-blue-300 dark:bg-blue-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังตรวจสอบ...
                    </>
                  ) : (
                    "ยืนยันรหัส"
                  )}
                </button>
              </div>

              <div className="text-sm text-center">
                <button className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  ส่งรหัสยืนยันอีกครั้ง
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">ยืนยันคำเชิญสำเร็จ!</h3>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  คุณได้รับสิทธิ์เป็นสตาฟในงาน
                </p>
                <p className="font-medium text-gray-900 dark:text-white mt-1">
                  {staffDetails?.eventName || "Web Summit 2023"}
                </p>
              </div>
              <div className="mt-6">
                <div className="rounded-md bg-gray-50 dark:bg-gray-700 px-6 py-5 sm:flex sm:items-center sm:justify-between">
                  <div className="sm:flex sm:items-center">
                    <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <div className="mt-3 sm:mt-0 sm:ml-4 text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        บูธที่คุณจัดการได้
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {staffDetails?.boothCount || 3} บูธ
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  href="/staff" 
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  เข้าสู่หน้าจัดการสตาฟ
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}