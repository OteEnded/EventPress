"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Modal from "@/ui/modals/InformationModal";
import TermsOfService from "@/ui/modals/TermsOfService";
import PrivacyPolicy from "@/ui/modals/PrivacyPolicy";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function OrganizerCreatePage() {
    
    const [userData, setUserData] = useState(null);
    
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    // State for organizer data
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const { data: session, status } = useSession();
    const router = useRouter();

    // Handle authentication with notification
    const [redirecting, setRedirecting] = useState(false);
    
    // Move all useEffect hooks before any conditional returns
    useEffect(() => {
        if (status === "unauthenticated" && !redirecting) {
            setRedirecting(true);
            // Show message for 2 seconds before redirecting
            setTimeout(() => {
                router.push("/organizer/login");
            }, 2000);
        }
    }, [status, router, redirecting]);
    
    useEffect(() => {
        const fetchUserData = async () => {
            if (userData) {
                return;
            }

            if (!session?.user?.email) {
                console.log("No session or email found");
                return;
            }

            try {
                const response = await fetch("/api/data/user/get/identity_email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ identity_email: session.user.email }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.status}`);
                }

                const data = await response.json();
                setUserData(data.content);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [session, userData]);

    // Show redirection message if not authenticated
    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] dark:bg-gray-900 text-white p-12">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">กรุณาเข้าสู่ระบบ</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">คุณต้องเข้าสู่ระบบก่อนสร้างองค์กร</p>
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                            <p className="text-gray-600 dark:text-gray-300">กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            setError("กรุณากรอกชื่อองค์กร");
            return;
        }

        try {
            
            const response = await fetch("/api/data/organizer/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    owner: userData.user_id, // Use the logged in user's ID as owner
                    name,
                    description,
                    website,
                    email,
                    phone_number: phoneNumber,
                    address,
                }),
            });

            const data = await response.json();
            
            if (response.ok && data.isSuccess) {
                console.log("Organizer created:", data);
                const form = e.target;
                form.reset();
                setError("");
                setSuccess("สร้างองค์กรสำเร็จแล้ว กำลังนำคุณไปยังหน้าองค์กร...");
                // Redirect after successful creation
                setTimeout(() => {
                    router.push(`/organizer/${data.content.organizer_id}`);
                }, 2000);
            } else {
                setError(data.error || "เกิดข้อผิดพลาดในการสร้างองค์กร");
            }
        } catch (error) {
            console.log("An error occurred while creating organizer:", error);
            setError("เกิดข้อผิดพลาดในการสร้างองค์กร");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] dark:bg-gray-900 text-white p-12">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold mb-4"> ลงทะเบียนองค์กร </h1>
                <p className="text-lg dark:text-gray-300 max-w-2xl">
                    ลงทะเบียนองค์กรของคุณเพื่อเริ่มต้นการสร้างอีเวนต์บน EventPress
                </p>
            </header>

            <section className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                            {success}
                        </div>
                    )}

                    <div className="mb-4">
                        <label
                            htmlFor="organization_name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            ชื่อองค์กร
                        </label>
                        <input
                            type="text"
                            id="organization_name"
                            name="organization_name"
                            className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="organization_description"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        > คำอธิบายเกี่ยวกับองค์กร
                        </label>
                        <textarea
                            id="organization_description"
                            name="organization_description"
                            className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="mb-4">  
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            เว็บไซต์องค์กร
                        </label>
                        <input
                            type="text"
                            id="website"
                            name="website"
                            className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="organization_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            อีเมลองค์กร   
                        </label>
                        <input
                            type="email"
                            id="organization_email"
                            name="organization_email"
                            className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="organization_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            เบอร์โทรติดต่อองค์กร
                        </label>
                        <input
                            type="text"
                            id="organization_phone"
                            name="organization_phone"
                            className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="organization_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            ที่อยู่
                        </label>
                        <textarea
                            id="organization_address"
                            name="organization_address"
                            className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            onChange={(e) => setAddress(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
                        >
                            สร้างองค์กร
                        </button>
                    </div>
                </form>
            </section>

        </div>
    );
}
