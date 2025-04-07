"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import eventPressLogo from "@public/eventpress-logo.png";

export default function StaffInvitationPage() {
  // Navigation and session
  const router = useRouter();
  const { data: session, status } = useSession();

  // UI state management
  const [invitationCode, setInvitationCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter code, Step 2: Verify email (if needed), Step 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [staffDetails, setStaffDetails] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [userId, setUserId] = useState(null);
  const [processingComplete, setProcessingComplete] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/organizer/staffinvitation");
    } else if (status === "authenticated" && session?.user?.email) {
      fetchUserId(session.user.email);
    }
  }, [status, session, router]);

  // Fetch user ID from email when session is available
  const fetchUserId = async (email) => {
    try {
      const response = await fetch("/api/data/user/get/identity_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identity_email: email }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.isSuccess) {
        throw new Error(data.message || "Failed to fetch user data");
      }
      
      setUserId(data.content.user_id);
    } catch (error) {
      console.error("Error fetching user ID:", error);
      setError("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  // Function to check invitation code
  const handleCheckCode = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Call API to check invitation code
      const response = await fetch("/api/data/staff/get/invitation_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invitation_code: invitationCode }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.isSuccess) {
        throw new Error(data.message || "รหัสเชิญไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง");
      }
      
      const staffTicket = data.content;
      setStaffDetails(staffTicket);
      
      // Check if staff ticket already has a connected user
      if (staffTicket.connected_user) {
        setError("รหัสเชิญนี้ถูกใช้งานไปแล้ว");
        setLoading(false);
        return;
      }
      
      // Check if verification is required
      if (staffTicket.verification_email) {
        // Verification required - send email and go to step 2
        const emailResponse = await fetch("/api/data/staff/email/accept/staff_ticket_id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ staff_tickets_id: staffTicket.staff_tickets_id }),
        });
        
        const emailData = await emailResponse.json();
        
        if (!emailResponse.ok || !emailData.isSuccess) {
          throw new Error("ไม่สามารถส่งอีเมลยืนยันได้ กรุณาลองใหม่อีกครั้ง");
        }
        
        setStep(2); // Move to verification step
      } else {
        // No verification required - directly connect user to staff ticket
        await connectUserToStaffTicket(staffTicket.staff_tickets_id);
      }
    } catch (error) {
      console.error("Error checking invitation code:", error);
      setError(error.message || "เกิดข้อผิดพลาดในการตรวจสอบรหัสเชิญ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // Function to connect user to staff ticket
  const connectUserToStaffTicket = async (staffTicketId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/data/staff/update/${staffTicketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staff_tickets_id: staffTicketId,
          connected_user: userId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.isSuccess) {
        throw new Error(data.message || "ไม่สามารถเชื่อมต่อกับรหัสเชิญได้ หรือคุณไม่มีสิทธิ์ในการเชื่อมต่อกับรหัสเชิญนี้");
      }
      
      // Success - get updated staff details
      const updatedStaffResponse = await fetch("/api/data/staff/get/staff_ticket_id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ staff_tickets_id: staffTicketId }),
      });
      
      const updatedStaffData = await updatedStaffResponse.json();
      
      if (updatedStaffResponse.ok && updatedStaffData.isSuccess) {
        setStaffDetails(updatedStaffData.content);
      }
      
      setProcessingComplete(true);
      setStep(3); // Move to success page
    } catch (error) {
      console.error("Error connecting user to staff ticket:", error);
      setError(error.message || "เกิดข้อผิดพลาดในการเชื่อมต่อกับรหัสเชิญ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // Function to resend verification code
  const handleResendVerificationCode = async () => {
    if (!staffDetails?.staff_tickets_id) return;
    
    setResendLoading(true);
    setResendSuccess(false);
    
    try {
      const response = await fetch("/api/data/staff/email/accept/staff_ticket_id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ staff_tickets_id: staffDetails.staff_tickets_id }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.isSuccess) {
        throw new Error("ไม่สามารถส่งอีเมลยืนยันได้ กรุณาลองใหม่อีกครั้ง");
      }
      
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (error) {
      console.error("Error resending verification code:", error);
      setError(error.message || "เกิดข้อผิดพลาดในการส่งรหัสยืนยันอีกครั้ง กรุณาลองใหม่อีกครั้ง");
    } finally {
      setResendLoading(false);
    }
  };

  // Function to verify code and connect user
  const handleVerifyCode = async () => {
    if (!staffDetails?.staff_tickets_id) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Extract the last section of UUID to compare with the verification code
      const uuidSections = staffDetails.staff_tickets_id.split("-");
      const lastUUIDSection = uuidSections[uuidSections.length - 1];
      
      if (verificationCode.trim() !== lastUUIDSection) {
        setError("รหัสยืนยันไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง");
        setLoading(false);
        return;
      }
      
      // Verification successful - connect user to staff ticket
      await connectUserToStaffTicket(staffDetails.staff_tickets_id);
    } catch (error) {
      console.error("Error verifying code:", error);
      setError(error.message || "เกิดข้อผิดพลาดในการยืนยันรหัส กรุณาลองใหม่อีกครั้ง");
      setLoading(false);
    }
  };

  // Redirect to organizer page after successful completion
  useEffect(() => {
    if (processingComplete && step === 3) {
      const timer = setTimeout(() => {
        router.push("/organizer");
      }, 5000); // Redirect after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [processingComplete, step, router]);

  // Loading state when checking authentication
  if (status === "loading" || (status === "authenticated" && !userId)) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
            width={120}
            height={120}
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
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
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
                <Link href="/organizer" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  กลับไปยังหน้า Organizer
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
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {resendSuccess && (
                <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ส่งรหัสยืนยันใหม่เรียบร้อยแล้ว
                      </p>
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
                    placeholder="กรอกรหัสยืนยัน"
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
                <button 
                  className={`font-medium ${
                    resendLoading 
                      ? "text-gray-400 dark:text-gray-500 cursor-not-allowed" 
                      : "text-blue-600 hover:text-blue-500 dark:text-blue-400 cursor-pointer"
                  }`}
                  onClick={resendLoading ? undefined : handleResendVerificationCode}
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3 inline-block text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังส่งรหัสยืนยัน...
                    </>
                  ) : (
                    "ส่งรหัสยืนยันอีกครั้ง"
                  )}
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
                  {staffDetails?.event?.name || "กำลังโหลดข้อมูลอีเวนต์..."}
                </p>
              </div>
              
              {staffDetails && (
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
                          {(staffDetails.Booths && staffDetails.Booths.length > 0)
                            ? `${staffDetails.Booths.length} บูธ`
                            : "ไม่มีบูธที่สามารถจัดการได้"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  คุณจะถูกนำไปยังหน้า Organizer ใน 5 วินาที
                </p>
                <Link 
                  href="/organizer" 
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  ไปยังหน้า Organizer ทันที
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}