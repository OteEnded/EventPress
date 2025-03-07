"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Modal from "@/ui/modals/InformationModal";
import TermsOfService from "@/ui/modals/TermsOfService";
import PrivacyPolicy from "@/ui/modals/PrivacyPolicy";

export default function OrganizerRegisterPage() {
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [agreement, setAgreement] = useState(false);
    const [error, setError] = useState(null);

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

        if (!name || !email || !password || !passwordConfirm) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const form = e.target;
                form.reset();
                setError(null);
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            console.log("An error occurred while registering.", error);
            setError("An error occurred while registering.");
        }

    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] dark:bg-gray-900 text-white px-6">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold mb-4"> SIGN UP </h1>
                <p className="text-lg dark:text-gray-300 max-w-2xl">
                    เข้าร่วม EventPress และเริ่มจัดการอีเวนต์ได้เลย.
                </p>
            </header>

            <section className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                <form onSubmit={handleSubmit}>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            ชื่อองค์กร/หน่วยงาน
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            อีเมล
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                            onChange={(e) => setEmail(e.target.value)}

                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            รหัสผ่าน
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password_confirm"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            รหัสผ่าน
                        </label>
                        <input
                            type="password"
                            id="password_confirm"
                            name="password_confirm"
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="terms"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                required
                                onChange={(e) => setAgreement(e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                                ฉันยอมรับ
                                <button
                                    type="button"
                                    onClick={() => setIsTermsOpen(true)}
                                    className="text-blue-600 dark:text-blue-400 hover:underline mx-1"
                                >
                                    นโยบายความเป็นส่วนตัว
                                </button>
                                และ
                                <button
                                    type="button"
                                    onClick={() => setIsPrivacyOpen(true)}
                                    className="text-blue-600 dark:text-blue-400 hover:underline mx-1"
                                >
                                    ข้อตกลงการใช้งาน
                                </button>
                                ของ EventPress
                            </span>
                        </label>
                    </div>

                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
                        >
                            ลงทะเบียน
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                    มีบัญชีอยู่แล้ว?{" "}
                    <Link href="/organizer/login">
                        <span className="text-blue-600 dark:text-blue-400 hover:underline">
                            เข้าสู่ระบบเลย
                        </span>
                    </Link>
                </p>
            </section>

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
