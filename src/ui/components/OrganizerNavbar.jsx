"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import { useTheme } from "../providers/ThemeProvider";
import eventPressLogo from "@public/eventpress-logo.png";

export default function OrganizerNavbar() {
    const { theme, toggleTheme } = useTheme();

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

            <div className="flex gap-4">
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
            </div>
        </div>
    );
}
