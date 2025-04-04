import Event from "@/lib/models/Event";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrganizerDashboardPage() {

    const session = await getServerSession(authOptions);

    // if !session redirect to root
    if (!session) {
        redirect("/");
    }

    const user = await User.getUserByIdentityEmail(session.user.email);

    const organize_name = "องค์กร"
    const event_name = "VitaminCNC"
    const event_description = "พวกเราทีม VitaminCNC จะมาช่วยน้องๆเสริมภูมิคุ้มกัน ซ้อมทำข้อสอบก่อนลงสนาม!! จากรุ่นพี่ผู้มีประสบการณ์ผ่าน"
    const event_of_user = await Event.getEventsOfUser(user.user_id);

    function get_events(organize) {
        let result = [];
        for (let event of organize.events) {
            result.push(
                <div
                    key={`${event["event_id"]}`} // Add a unique key for each event
                    className="bg-white dark:bg-gray-900 p-16 my-5 dark:text-white text-gray-700"
                >
                    <h2 className="text-2xl font-semibold ">
                        {event.name}
                    </h2>
                    <p>
                        {event.description}
                    </p>

                    <Link href={`/organizer/${organize["organizer"]["organizer_id"]}/event/${event["event_id"]}`}>
                    <button className="px-3 py-3 mt-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                        แก้ไข
                    </button>
                    </Link>
                </div>
            );
        }
        return result;
    }
    
    function get_organizes() {
        let result = [];
        for (let organize of event_of_user){
            result.push(
                <div key={`${organize["organizer"]["organizer_id"]}`}> 
                    {/* Add a unique key for each organize */}
                    <h2 className="text-2xl font-semibold mb-4 mt-4 text-gray-700 dark:text-white">
                        {organize.organizer.name}
                    </h2>
                    <Link href={`/organizer/${organize["organizer"]["organizer_id"]}/event/create`}>
                        <button className="px-3 py-3 mt-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                            สร้าง
                        </button>
                    </Link>
                    <div className="flex flex-col gap-5">
                        {get_events(organize)}
                    </div>
                </div>
            );

        }
        return result;
    }


    return (
        <>
            <div className="min-h-screen flex flex-col bg-[#5E9BD6] text-gray-700 dark:bg-gray-900 px-6">
                <div className="bg-white dark:bg-gray-800 dark:text-white p-16  border-primary my-5 flex flex-col w-full ">
                    <h1 className="text-3xl font-semibold mb-4"> อีเวนต์ของฉัน </h1>
                    <div>
                        {get_organizes()}
                    </div>
                </div>
            </div>
        </>
    );
}
