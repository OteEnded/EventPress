"use client"; // Now it's a client component

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "../providers/ThemeProvider"; // Import Theme Context
import ThemeToggle from "../components/ThemeToggle"; // Add this import

export default function LandingPage() {
    const { theme } = useTheme(); // Now it works (only inside client components)

    return (
        <>
            <div className="p-4 flex justify-end">
                <ThemeToggle /> {/* Now it should work! */}
            </div>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 px-6">
                {/* Header Section */}
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold mb-4">EventPress</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                        Simplify event management with an intuitive platform
                        designed for organizers. Create, customize, and manage
                        events with ease.
                    </p>
                </header>

                {/* Organizer Benefits Section */}
                <section className="max-w-4xl text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md mb-12">
                    <h2 className="text-3xl font-semibold mb-4">
                        Why Choose EventPress?
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        EventPress empowers event organizers to build customized
                        event pages effortlessly. No coding required—just a
                        powerful, easy-to-use interface.
                    </p>

                    <div className="mt-6 grid md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
                            <h3 className="font-semibold text-xl">
                                📌 Drag-and-Drop Builder
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                Easily create interactive event pages with
                                prebuilt components.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
                            <h3 className="font-semibold text-xl">
                                📅 Schedule & Booth Management
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                Organize activities, booths, and speakers in one
                                place.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
                            <h3 className="font-semibold text-xl">
                                📊 Analytics & Engagement
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                Gain insights into attendees, engagement, and
                                event performance.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Start Organizing Your Event Today
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-xl">
                        Join other event organizers in streamlining event
                        management. Create engaging event pages and enhance
                        attendee experience effortlessly.
                    </p>
                    <Link href="/register">
                        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                            Register as an Organizer
                        </button>
                    </Link>
                </section>
            </div>
        </>
    );
}
