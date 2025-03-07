"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "../modals/InformationModal";
import TermsOfService from "../modals/TermsOfService";
import PrivacyPolicy from "../modals/PrivacyPolicy";

export default function LoginForm() {
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] dark:bg-gray-900 text-white px-6">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold mb-4"> LOGIN </h1>
                {/* <p className="text-lg dark:text-gray-300 max-w-2xl">
          เข้าร่วม EventPress และเริ่มจัดการอีเวนต์ได้เลย.
        </p> */}
            </header>

            <section className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                <form>
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
                        />
                    </div>

                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
                        >
                            เข้าสู่ระบบ
                        </button>
                    </div>
                </form>
                <div className="mb-4">
                    <label className="flex items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            <Link href="/">
                                <button
                                    type="button"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    ลืมรหัสผ่าน?
                                </button>
                            </Link>
                        </span>
                    </label>
                </div>
            </section>
        </div>
    );
}
