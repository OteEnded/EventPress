"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { use, useEffect, useState } from "react";
import { useTheme } from "../providers/ThemeProvider";
import eventPressLogo from "@public/eventpress-logo.png";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function OrganizerNavbar() {
    // const { theme, toggleTheme } = useTheme();
    const [userData, setUserData] = useState(null);

    const { data: session } = useSession();
    // console.log(session);
    
    // const userData = await fetch("/api/data/user/user_id", {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    // });
    
    useEffect(() => {
        const fetchUserData = async () => {
            if (userData) {
                // If userData is already set, do nothing
                return;
            }
    
            if (!session?.user?.email) {
                console.error("No session or email found");
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
    }, [session, userData]); // Add userData as a dependency

    return (
        <div className="px-2 py-1 flex justify-between items-center">
            <div className="p-4 gap-4 flex">
                <Image
                    src={eventPressLogo}
                    alt="Event Press logo"
                    width={40}
                    height={40}
                    // className="max-w-[40px] max-h-[40px]"
                />
                <ThemeToggle />
            </div>

            {JSON.stringify(userData)}

            <div className="flex gap-4">
                {!session ? (
                    <>
                        <Link href="/organizer/staffinvitation">
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                Staff Invitation Login
                            </button>
                        </Link>
                        <Link href="/organizer/login">
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                Login
                            </button>
                        </Link>
                    </>
                ) : (
                    <a onClick={() => signOut({ redirect: false })}>
                        <button className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 transition">
                            Logout
                        </button>
                    </a>
                )}
            </div>
        </div>
    );
}
