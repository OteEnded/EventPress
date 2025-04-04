"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import eventPressLogo from "@public/eventpress-logo.png";
import { signOut } from "next-auth/react";

export default function OrganizerNavbar() {
    const [userData, setUserData] = useState(null);
    const { data: session } = useSession();

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
        if (!userData) return "Loading...";
        const profile = userData.UserProfile;

        if (!profile) {
            return userData.identity_email;
        }

        if (profile.display_name) {
            return profile.display_name;
        }

        return `${profile.firstname} ${profile.lastname}`;
    };

    return (
        <div className="px-4 py-2 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
            {/* Logo and Theme Toggle */}
            <div className="flex items-center gap-4">
                <Image
                    src={eventPressLogo}
                    alt="Event Press logo"
                    width={40}
                    height={40}
                />
                <ThemeToggle />
            </div>

            {/* Login/Logout Buttons and User Info */}
            <div className="flex items-center gap-4">
                {userData && (
                    <div className="text-right">
                        <p className="text-lg font-semibold text-gray-700 dark:text-white">
                            {getDisplayName()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {userData.identity_email}
                        </p>
                    </div>
                )}
                {!userData && (
                    <div className="text-gray-500 dark:text-gray-400">Loading...</div>
                )}
                {!session ? (
                    <>
                        <Link href="/organizer/staffinvitation">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                Staff Invitation Login
                            </button>
                        </Link>
                        <Link href="/organizer/login">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                Login
                            </button>
                        </Link>
                    </>
                ) : (
                    <button
                        onClick={() => signOut({ redirect: true })}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 transition"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
}