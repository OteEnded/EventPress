"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Modal from "@/ui/modals/InformationModal";
import TermsOfService from "@/ui/modals/TermsOfService";
import PrivacyPolicy from "@/ui/modals/PrivacyPolicy";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Add custom CSS to hide number input spinners
const hideNumberInputSpinners = {
    WebkitAppearance: "none",
    MozAppearance: "textfield",
    appearance: "textfield",
    margin: 0
};

export default function OrganizerRegisterPage() {
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [indentityEmail, setIndentityEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [agreement, setAgreement] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const { data: session } = useSession();

    // Handle session redirect in useEffect instead of at the component level
    useEffect(() => {
        if (session) {
            router.push("/organizer");
        }
    }, [session, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreement) {
            setError("Please agree to the terms and conditions.");
            return;
        }

        if (password !== passwordConfirm) {
            setError("Passwords do not match.");
            return;
        }

        if (!firstname || !lastname || !indentityEmail || !password || !passwordConfirm) {
            setError("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            // 1. Register the user
            const registerResponse = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    indentity_email: indentityEmail,
                    password,
                    firstname,
                    lastname,
                    display_name: displayName,
                    phone_number: phoneNumber,
                }),
            });

            if (!registerResponse.ok) {
                const data = await registerResponse.json();
                throw new Error(data.message || "Registration failed");
            }

            const registerData = await registerResponse.json();
            setSuccess("Registration successful. Logging you in...");
            
            // Add a delay before auto-login to give the user time to see the message
            setTimeout(async () => {
                // 2. Auto-login the user after successful registration
                const loginResponse = await signIn("credentials", {
                    redirect: false,
                    indentity_email: indentityEmail,
                    password: password
                });
                
                if (loginResponse.error) {
                    // If login fails, show success message but with a link to login page
                    setSuccess("Registration successful! Please login with your credentials.");
                    
                    // Reset the form
                    e.target.reset();
                    setPassword("");
                    setPasswordConfirm("");
                } else {
                    // If login succeeds, redirect to organizer page
                    router.push("/organizer");
                }
            }, 2000); // 2 seconds delay
            
        } catch (error) {
            console.log("An error occurred:", error);
            setError(error.message || "An error occurred while registering.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#5E9BD6] to-[#4A7CB0] dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 px-4 py-12">
            <div className="w-full max-w-lg">
                {/* Header Section */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white">
                        สร้างบัญชีใหม่
                    </h1>
                    <p className="text-lg text-white/80 dark:text-gray-300">
                        เข้าร่วม EventPress และเริ่มจัดการอีเวนต์ได้เลย
                    </p>
                </header>

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    {/* Form Alert Messages */}
                    {(error || success) && (
                        <div className={`px-6 py-4 border-b ${error ? 'bg-red-50 border-red-100 dark:bg-red-900/30 dark:border-red-800/30' : 'bg-green-50 border-green-100 dark:bg-green-900/30 dark:border-green-800/30'}`}>
                            {error && (
                                <div className="text-red-700 dark:text-red-400 flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}
                            {success && (
                                <div className="text-green-700 dark:text-green-400 flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{success}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        {/* Personal Information Section */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                ข้อมูลส่วนตัว
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="firstname"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    >
                                        ชื่อจริง <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        placeholder="กรอกชื่อจริงของคุณ"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500"
                                        required
                                        onChange={(e) => setFirstname(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="lastname"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    >
                                        นามสกุล <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        placeholder="กรอกนามสกุลของคุณ"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500"
                                        required
                                        onChange={(e) => setLastname(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label
                                    htmlFor="display_name"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    ชื่อที่ใช้แสดง
                                </label>
                                <input
                                    type="text"
                                    id="display_name"
                                    name="display_name"
                                    placeholder="ชื่อที่ต้องการให้แสดงในระบบ"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500"
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                            </div>

                            <div className="mt-4">
                                <label
                                    htmlFor="phone_number"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    เบอร์โทรศัพท์
                                </label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    placeholder="เบอร์โทรศัพท์สำหรับติดต่อ"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500"
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Account Information Section */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                ข้อมูลบัญชี
                            </h2>
                            
                            <div>
                                <label
                                    htmlFor="indentity_email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    อีเมล <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="indentity_email"
                                    name="indentity_email"
                                    placeholder="อีเมลสำหรับเข้าสู่ระบบ"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500"
                                    required
                                    onChange={(e) => setIndentityEmail(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    >
                                        รหัสผ่าน <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500"
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password_confirm"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    >
                                        ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password_confirm"
                                        name="password_confirm"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500"
                                        required
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms & Agreement */}
                        <div className="mb-6">
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="terms"
                                    className="h-5 w-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    required
                                    onChange={(e) => setAgreement(e.target.checked)}
                                />
                                <span className="ml-2.5 text-sm text-gray-600 dark:text-gray-300">
                                    ฉันยอมรับ{" "}
                                    <button
                                        type="button"
                                        onClick={() => setIsTermsOpen(true)}
                                        className="text-blue-600 dark:text-blue-400 hover:underline mx-1 font-medium"
                                    >
                                        นโยบายความเป็นส่วนตัว
                                    </button>
                                    และ{" "}
                                    <button
                                        type="button"
                                        onClick={() => setIsPrivacyOpen(true)}
                                        className="text-blue-600 dark:text-blue-400 hover:underline mx-1 font-medium"
                                    >
                                        ข้อตกลงการใช้งาน
                                    </button>
                                    ของ EventPress
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="mb-4">
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold transition-colors duration-200 shadow-sm flex justify-center items-center"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        กำลังลงทะเบียน...
                                    </>
                                ) : (
                                    "ลงทะเบียน"
                                )}
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-gray-600 dark:text-gray-300">
                                มีบัญชีอยู่แล้ว?{" "}
                                <Link href="/organizer/login">
                                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium">
                                        เข้าสู่ระบบเลย
                                    </span>
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isTermsOpen}
                onClose={() => setIsTermsOpen(false)}
                title="Terms of Service"
            >
                <TermsOfService />
            </Modal>

            <Modal
                isOpen={isPrivacyOpen}
                onClose={() => setIsPrivacyOpen(false)}
                title="Privacy Policy"
            >
                <PrivacyPolicy />
            </Modal>
        </div>
    );
}
