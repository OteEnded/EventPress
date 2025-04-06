import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";
import Link from "next/link";

// export const metadata = {
//   title: "EventPress",
//   description: "",
// };

export default async function OrganizerInnerLayout({ children }) {
    
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] dark:bg-gray-900 text-white p-12">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">กรุณาเข้าสู่ระบบ</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">คุณจำเป็นต้องเข้าสู่ระบบเพื่อเข้าถึงหน้านี้</p>
                        
                        <Link href="/organizer/login">
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                เข้าสู่ระบบ
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <>
        {children}
        </>);
}
