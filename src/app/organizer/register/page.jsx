import RegisterForm from "../../../ui/pages/RegisterForm";
import ThemeToggle from "../../../ui/components/ThemeToggle";
import Link from "next/link";
import Image from 'next/image'

export const metadata = {
  title: "Register as an Organizer - EventPress",
  description: "Join EventPress and start organizing your events with ease.",
};

export default function OrganizerRegisterPage() {
  return (
    <>
        {/* navbar */}
        <div className="p-4 flex justify-between items-center">
                <div className="p-4 gap-4 flex">
                    <Image
                        src={"/globe.svg"}
                        width={22}
                        height={22}
                        alt="logo"
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

            <RegisterForm />;
    </>
  )
}