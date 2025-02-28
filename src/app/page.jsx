import ThemeToggle from "../ui/components/ThemeToggle";
import Link from "next/link";
import Image from 'next/image'
// import "./globals.css";

export const metadata = {
    title: "EventPress - Simplify Event Management",
    description: "Easily create and manage event pages with EventPress.",
};

export default async function HomePage() {
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

            {/* <LandingPage /> */}
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] text-gray-700 dark:bg-gray-900 dark:text-gray-100 px-6">
                {/* Header Section */}
                <header className="text-center mb-12">
                    <h1 className="text-5xl text-white font-extrabold mb-4">EventPress</h1>
                    <p className="text-lg text-gray-100 dark:text-gray-300 max-w-2xl">
                    แพลตฟอร์มช่วยประกาศอีเวนท์ รู้ลึกถึงกิจกรรมในแต่ละบูธ และสิ่งที่คุณจะได้พบ
                    </p>
                </header>

                {/* Organizer Benefits Section */}
                <section className="max-w-4xl text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md mb-12">
                    <h2 className="text-3xl font-semibold mb-4">
                        ทำไมต้อง EventPress?
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        EventPress ช่วยให้ผู้จัดงานสามารถสร้างหน้าเว็บไซต์งานที่กำหนดเองได้อย่างง่ายดาย โดยไม่จำเป็นต้องเขียนโค้ด—เพียงแค่ใช้ส่วนติดต่อที่ทรงพลังและใช้งานง่าย
                    </p>

                    <div className="mt-6 grid md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
                            <h3 className="font-semibold text-xl">
                                📌 ตัวสร้างแบบลากและวาง
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">                           
                                สร้างหน้าเว็บไซต์งานที่มีปฏิสัมพันธ์ได้ง่ายๆ ด้วยส่วนประกอบที่สร้างไว้ล่วงหน้า
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
                            <h3 className="font-semibold text-xl">
                                📅 การจัดการกำหนดการและบูธ
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                จัดระเบียบกิจกรรม บูธ ในที่เดียว
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
                            <h3 className="font-semibold text-xl">
                                📊 การวิเคราะห์และการมีส่วนร่วม
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                รับข้อมูลเชิงลึกเกี่ยวกับผู้เข้าร่วม การมีส่วนร่วม และผลการดำเนินงานของงาน
                            </p>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-center">
                    {/* <h2 className="text-2xl font-bold mb-4">
                        Start Organizing Your Event Today
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-xl">
                        Join other event organizers in streamlining event
                        management. Create engaging event pages and enhance
                        attendee experience effortlessly.
                    </p> */}
                    <Link href="/organizer/register">
                        <button className="px-6 py-3 bg-white text-[#5E9BD6] rounded-lg text-xl font-semibold hover:bg-blue-700 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                            ลงทะเบียนเลย!
                        </button>
                    </Link>
                    <p className="mt-4 text-gray-100 dark:text-gray-300">
                        มีบัญชีอยู่แล้ว?{" "}
                        <Link href="/organizer/login">
                            <span className="text-gray-700 dark:text-blue-400 hover:underline">
                                เข้าสู่ระบบเลย
                            </span>
                        </Link>
                    </p>
                </section>
            </div>
        </>
    );
}
