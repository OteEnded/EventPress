"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import eventPressLogo from "@public/eventpress-logo.png";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function OrganizerNavbar() {
    const [userData, setUserData] = useState(null);
    const { data: session } = useSession();
    const pathname = usePathname();
    
    // Check current page to determine which button to show
    const isLoginPage = pathname === "/organizer/login";
    const isRegisterPage = pathname === "/organizer/register";

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

    // Determine the username to display
    const getDisplayName = () => {
        if (!session) return null; // Return null when no session exists
        if (!userData) return "Loading..."; // Only show loading if session exists but userData doesn't
        
        const profile = userData.UserProfile;

        if (!profile) {
            return userData.identity_email;
        }

        if (profile.display_name) {
            return profile.display_name;
        }

        return `${profile.firstname} ${profile.lastname}`;
    };

    // Check if user is a system admin
    const isSystemAdmin = userData?.SystemAdmin !== null;

    return (
        <div className="px-4 py-2 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
            {/* Logo and Theme Toggle */}
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Image
                        src={eventPressLogo}
                        alt="Event Press logo"
                        width={40}
                        height={40}
                        className="cursor-pointer"
                    />
                </Link>
                <ThemeToggle />
            </div>

            {/* Login/Logout Buttons and User Info */}
            <div className="flex items-center gap-4">
                {session && (
                    <div className="text-right">
                        <p className="text-lg font-semibold text-gray-700 dark:text-white">
                            {getDisplayName() || "Loading..."}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {userData?.identity_email || session.user.email}
                        </p>
                        {isSystemAdmin && (
                            <p className="text-xs text-red-500 dark:text-red-400 font-medium">
                                หมายเลขผู้ดูแลระบบ: {userData?.user_id}
                            </p>
                        )}
                    </div>
                )}
                {!session ? (
                    <>
                        <Link href="/organizer/staffinvitation">
                            <button className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 rounded-lg text-sm font-semibold transition border border-gray-300 dark:border-gray-600">
                            รับคำเชิญสตาฟ
                            </button>
                        </Link>
                        
                        {/* Dynamically show register button on login page */}
                        {isLoginPage && (
                            <Link href="/organizer/register">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                ลงทะเบียน
                                </button>
                            </Link>
                        )}
                        
                        {/* Dynamically show login button on register page */}
                        {isRegisterPage && (
                            <Link href="/organizer/login">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                เข้าสู่ระบบ
                                </button>
                            </Link>
                        )}
                        
                        {/* Show default login button when not on login/register pages */}
                        {!isLoginPage && !isRegisterPage && (
                            <Link href="/organizer/login">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                เข้าสู่ระบบ
                                </button>
                            </Link>
                        )}
                    </>
                ) : (
                    <button
                        onClick={() => signOut({ redirect: true })}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 transition"
                    >
                        ออกจากระบบ
                    </button>
                )}
            </div>
        </div>
    );
}