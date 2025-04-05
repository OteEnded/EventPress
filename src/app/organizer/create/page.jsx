"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Modal from "@/ui/modals/InformationModal";
import TermsOfService from "@/ui/modals/TermsOfService";
import PrivacyPolicy from "@/ui/modals/PrivacyPolicy";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function OrganizerRegisterPage() {
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [age, setAge] = useState("");
    const [indentityEmail, setIndentityEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [agreement, setAgreement] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const { data: session } = useSession();
    // const router = useRouter();

    // if (!session) {
    //     redirect("/");
    // }

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

        try {
            const response = await fetch("/api/auth/register", {
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
                    age,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const form = e.target;
                form.reset();
                setError(null);
                setSuccess("Registration successful.");
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            console.log("An error occurred while registering.", error);
            setError("An error occurred while registering.");
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
                            required></input>
                    </div>


                    <div className="mb-4">
                        <label
                            htmlFor="organization_description"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        > คำอธิบายเกี่ยวกับองค์กร
                        </label>
                        <textarea
                        type="text"
                        id="organization_description"
                        name="organization_description"
                        className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required></textarea>
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
                        required></input>
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="organization_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            อีเมลองค์กร   
                        </label>
                        <input
                        type="text"
                        id="organization_email"
                        name="organization_email"
                        className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required></input>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="organization_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            หมายเลขโทรศัพท์องค์กร
                        </label>
                        <input
                        type="text"
                        id="organization_phone"
                        name="organization_phone"
                        className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required></input>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="organization_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            ที่อยู่
                        </label>
                        <textarea
                            type="text"
                            id="organization_address"
                            name="organization_address"
                            className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        ></textarea>
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
