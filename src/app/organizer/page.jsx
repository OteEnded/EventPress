export default async function OrganizerDashboardPage() {

    const organize_name = "องค์กร"
    const event_name = "VitaminCNC"
    const event_description = "พวกเราทีม VitaminCNC จะมาช่วยน้องๆเสริมภูมิคุ้มกัน ซ้อมทำข้อสอบก่อนลงสนาม!! จากรุ่นพี่ผู้มีประสบการณ์ผ่าน"
    

    function get_events(){

        let result = [];
        for (let i = 0; i < 3; i++) {
            result.push(

                <div className="bg-white dark:bg-gray-900 p-16 my-5 dark:text-white  text-gray-700">
                    <h2 className="text-2xl font-semibold ">
                        {event_name}
                    </h2>
                    <p>
                        {event_description}
                    </p>
                    <button className="px-3 py-3 mt-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                        แก้ไข
                    </button>
                </div>

            );
        }
        return result;
    }

    function get_organizes(){
        let result = [];
        for (let i = 0; i < 2; i++) {
            result.push(
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-white" >
                        {organize_name}
                    </h2>
                    {get_events()}
                </div>
            );
        }
        return result;
    }


    return (
        <>
            <div className="min-h-screen flex flex-col bg-[#5E9BD6] text-gray-700 dark:bg-gray-900 px-6">
                <div className="bg-white dark:bg-gray-800 dark:text-white p-16  border-primary my-5 flex flex-col w-full ">
                    <h1 className="text-3xl font-semibold mb-8"> อีเวนต์ของฉัน </h1>
                    <div>
                        {get_organizes()}
                    </div>
                </div>
            </div>
        </>
    );
}
