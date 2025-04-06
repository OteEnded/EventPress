"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    
    const [indentity_email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/organizer");
        }
    }, [session, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await signIn("credentials", {
                redirect: false,
                indentity_email,
                password,
            });

            if (res.error) {
                setError(res.error);
                return;
            } 
            
            router.push("/organizer");
        } catch (error) {
            setError("An error occurred. Please try again later.");
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#5E9BD6] to-[#4A7CB0] dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white">
                        เข้าสู่ระบบ
                    </h1>
                    <p className="text-lg text-white/80 dark:text-gray-300">
                        เข้าสู่ระบบเพื่อจัดการอีเวนต์ของคุณ
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
                        <div className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    อีเมล
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500"
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    รหัสผ่าน
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500"
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                                <Link href="/organizer/forgotpassword">
                                    <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        ลืมรหัสผ่าน?
                                    </span>
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold transition-colors duration-200 shadow-sm flex justify-center items-center"
                                >
                                    เข้าสู่ระบบ
                                </button>
                            </div>
                        </div>

                        {/* Register Link */}
                        <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                ยังไม่มีบัญชี?{" "}
                                <Link href="/organizer/register">
                                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium">
                                        ลงทะเบียนเลย
                                    </span>
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
